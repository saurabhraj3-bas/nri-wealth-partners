import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import { ConversationRecord, generateInsightsHTML } from '@/lib/chatbot-analytics'

export async function GET(req: NextRequest) {
  try {
    // Read all conversation records
    const analyticsFile = path.join(process.cwd(), 'chatbot-analytics', 'conversations.jsonl')

    if (!fs.existsSync(analyticsFile)) {
      return NextResponse.json({
        message: 'No conversations found yet',
        insights: null
      })
    }

    const fileContent = fs.readFileSync(analyticsFile, 'utf-8')
    const records: ConversationRecord[] = fileContent
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line))

    if (records.length === 0) {
      return NextResponse.json({
        message: 'No conversations to analyze',
        insights: null
      })
    }

    // Generate insights HTML
    const insightsHTML = generateInsightsHTML(records)

    // Email insights report
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      })

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER,
        subject: `📊 AI Chatbot Analytics Report - ${records.length} Conversations`,
        html: insightsHTML,
      })

      return NextResponse.json({
        success: true,
        message: `Analytics report emailed successfully! Analyzed ${records.length} conversations from ${new Set(records.map(r => r.userEmail)).size} unique users.`,
        totalConversations: records.length,
        uniqueUsers: new Set(records.map(r => r.userEmail)).size
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Email not configured',
        insights: insightsHTML
      })
    }

  } catch (error: any) {
    console.error('Error generating insights:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights', details: error.message },
      { status: 500 }
    )
  }
}
