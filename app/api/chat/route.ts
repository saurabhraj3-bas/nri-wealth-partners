import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { analyzeConversation, type ConversationRecord } from '@/lib/chatbot-analytics'

// Initialize Google GenAI client (new unified SDK for Gemini 2.0+)
const getClient = () => {
  return new GoogleGenAI({
    apiKey: process.env.GOOGLE_AI_API_KEY || '',
  })
}

// System prompt for NRI Wealth Partners chatbot
const SYSTEM_PROMPT = `You are a helpful AI assistant for NRI Wealth Partners, a SEBI-registered financial advisory firm specializing in NRI wealth management.

ABSOLUTE REQUIREMENTS - VIOLATING THESE WILL FAIL:
- Write ONLY 2-3 sentences of information + 1 question sentence = EXACTLY 3-4 sentences total
- MAXIMUM 60 words TOTAL - anything longer will be rejected
- Write in ONE paragraph ONLY - no line breaks, no lists, no formatting
- FORBIDDEN: bullet points (•, *, -), numbered lists (1. 2. 3.), colons followed by lists
- Write like a casual text message to a friend, NOT a formal consultation
- COMPLETE every sentence - partial sentences are strictly forbidden

CRITICAL: WHEN USERS WANT TO CONNECT WITH A HUMAN:
- ALWAYS direct them to NRI Wealth Partners' advisors
- NEVER suggest finding other advisors, asking friends for referrals, or looking elsewhere
- Provide: "Schedule a free consultation at support@nriwealthpartners.com or call +91 9974742626"
- Use phrases: "Our SEBI-registered advisors can help" or "Let's connect you with our team"

STAY IN SCOPE:
- ONLY talk about NRI Wealth Partners services and expertise
- NEVER suggest external resources, other companies, or finding advisors elsewhere
- You represent OUR company - keep all guidance within our services

Our services by journey:
🏗️ BUILDING WEALTH: Investments, Mutual Funds, Portfolio Management
🌐 SPECIALIZED SOLUTIONS: GIFT City, Virtual Family Office
📋 REGULATORY & TAX: Tax Planning, Compliance (FEMA, FATCA, CRS)
🏡 LIFE TRANSITIONS: Moving Back, Retirement, Estate Planning

PERFECT EXAMPLES (crisp AND complete):

User: "I want to move back to India"
You: "Moving back involves tax residency planning, RNOR benefits, and asset repatriation. We help NRIs transition smoothly with compliance support. Are you planning to return permanently or split time between countries?"

User: "Can you connect me to a human?" or "I want to talk to someone"
You: "Absolutely! Our SEBI-registered advisors are ready to help with personalized guidance. Email support@nriwealthpartners.com or call +91 9974742626 to schedule your free consultation. What specific area would you like to discuss?"

User: "Tell me about tax planning"
You: "We specialize in NRI tax optimization including RNOR status, foreign income exemptions, and treaty benefits. Our advisors create compliant tax strategies. What's your current residency status?"

FORBIDDEN EXAMPLES:
❌ "I can't connect you directly. Try asking friends for referrals or finding other advisors..."  [NEVER send users elsewhere!]
❌ "Here's what you need to know: 1. Tax implications 2. Residency status..." [No lists!]
❌ "Let me understand your needs: • Your location • Your citizenship..." [No bullets!]

REMEMBER: 2-3 sentences + 1 question = Done. Always direct to OUR company, never elsewhere!`

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory, userEmail } = await req.json()

    if (!message || !userEmail) {
      return NextResponse.json(
        { error: 'Message and user email are required' },
        { status: 400 }
      )
    }

    // Check if API key is configured
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'AI chatbot is not configured. Please add GOOGLE_AI_API_KEY to environment variables.' },
        { status: 503 }
      )
    }

    // Build chat history for context
    const chatHistory = conversationHistory?.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })) || []

    // Initialize client and create chat session
    const client = getClient()

    // Using Gemini 2.0 Flash ($0.10 input, $0.40 output per 1M tokens)
    // Free tier: 1,500 requests/day, 1M tokens/minute
    // Available models:
    // - gemini-2.0-flash: Stable production model (recommended)
    // - gemini-2.5-flash: Newest with thinking ($0.30 input, $2.50 output)
    const chatSession = client.chats.create({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
      history: chatHistory,
      config: {
        maxOutputTokens: 150,  // Enough for 3-4 complete sentences (~60-80 words)
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    } as any)

    // Send message and get response
    const result = await chatSession.sendMessage({ message })
    let aiResponse = result.text || ''

    // AGGRESSIVE post-processing to enforce SHORT, conversational responses
    // 1. Remove all bullet points and list markers
    aiResponse = aiResponse
      .replace(/^\s*[\*\-\•]\s+/gm, '') // Remove bullet points at start of lines
      .replace(/^\s*\d+\.\s+/gm, '')    // Remove numbered lists
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markdown
      .replace(/\n\n+/g, ' ')            // Remove multiple line breaks
      .replace(/\n/g, ' ')               // Convert single line breaks to spaces
      .trim()

    // 2. Take only first 3-4 sentences (stop at question mark if present)
    const sentences = aiResponse.match(/[^.!?]+[.!?]+/g) || []
    if (sentences.length > 4) {
      // Keep first 3 sentences + check if 4th ends with "?"
      const first3 = sentences.slice(0, 3).join(' ')
      const fourth = sentences[3]
      aiResponse = fourth && fourth.trim().endsWith('?')
        ? first3 + ' ' + fourth
        : first3
    }

    // 3. Final cleanup
    aiResponse = aiResponse.trim()

    // Save conversation to storage
    await saveConversation({
      userEmail,
      userMessage: message,
      aiResponse,
      timestamp: new Date().toISOString(),
      conversationHistory: [
        ...chatHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse }
      ]
    })

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Chat API Error:', error)

    // Provide helpful error messages
    let errorMessage = 'Failed to process chat message'
    let statusCode = 500

    if (error.message?.includes('API key')) {
      errorMessage = 'Invalid API key. Please check your Google AI API key configuration.'
      statusCode = 401
    } else if (error.message?.includes('quota')) {
      errorMessage = 'API quota exceeded. Please try again later.'
      statusCode = 429
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.message
      },
      { status: statusCode }
    )
  }
}

// Save conversation to Google Sheets or database
async function saveConversation(data: {
  userEmail: string
  userMessage: string
  aiResponse: string
  timestamp: string
  conversationHistory: any[]
}) {
  try {
    // Analyze conversation for insights
    const { services, intent } = analyzeConversation(data.userMessage, data.aiResponse)

    // Create analytics record
    const analyticsRecord: ConversationRecord = {
      timestamp: data.timestamp,
      userEmail: data.userEmail,
      userMessage: data.userMessage,
      aiResponse: data.aiResponse,
      conversationLength: data.conversationHistory.length,
      serviceMentioned: services,
      intent: intent,
    }

    // Save to analytics file
    const analyticsDir = path.join(process.cwd(), 'chatbot-analytics')
    const analyticsFile = path.join(analyticsDir, 'conversations.jsonl')

    if (!fs.existsSync(analyticsDir)) {
      fs.mkdirSync(analyticsDir, { recursive: true })
    }

    fs.appendFileSync(analyticsFile, JSON.stringify(analyticsRecord) + '\n', 'utf-8')

    // Email conversation to admin for compliance
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      })

      const conversationText = data.conversationHistory
        .map((msg: any, i: number) => `${i + 1}. ${msg.role.toUpperCase()}: ${msg.content}`)
        .join('\n\n')

      // Color code by intent
      const intentColor = intent.includes('High') ? '#16a34a' : intent.includes('Medium') ? '#ea580c' : '#6b7280'

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER,
        subject: `💬 Chatbot - ${data.userEmail} - ${intent}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #1e3a8a;">AI Chatbot Conversation Record</h2>

            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Date/Time:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
              <p><strong>User Email:</strong> ${data.userEmail}</p>
              <p><strong>Total Messages:</strong> ${data.conversationHistory.length}</p>
              <p><strong>Intent:</strong> <span style="color: ${intentColor}; font-weight: bold;">${intent}</span></p>
              ${services.length > 0 ? `<p><strong>Services Mentioned:</strong> ${services.join(', ')}</p>` : ''}
            </div>

            <h3>Latest Exchange:</h3>
            <div style="background: #fff; border-left: 4px solid #1e3a8a; padding: 10px; margin: 10px 0;">
              <p><strong>User:</strong> ${data.userMessage}</p>
            </div>
            <div style="background: #fff; border-left: 4px solid #d4af37; padding: 10px; margin: 10px 0;">
              <p><strong>AI:</strong> ${data.aiResponse}</p>
            </div>

            <h3>Full Conversation:</h3>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;">${conversationText}</pre>

            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">This email was sent automatically by the NRI Wealth Partners AI Chatbot system for archival and compliance purposes.</p>
          </div>
        `,
      })

      console.log(`✅ Conversation archived: ${data.userEmail} | Intent: ${intent} | Services: ${services.join(', ') || 'None'}`)
    }

  } catch (error) {
    console.error('❌ Error archiving conversation:', error)
    // Don't fail the chat if archiving fails
  }
}
