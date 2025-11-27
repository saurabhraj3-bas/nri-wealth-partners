import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTopicById } from '@/lib/content-generator-topics';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions
    if (!session.user.permissions.draftNewsletter && !session.user.permissions.manageWebinars) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { topicId, customizations } = await req.json();

    if (!topicId) {
      return NextResponse.json(
        { error: 'Topic ID is required' },
        { status: 400 }
      );
    }

    // Get topic details
    const topic = getTopicById(topicId);
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Generate content using AI
    const content = await generateContentWithAI(topic, customizations);

    return NextResponse.json({
      success: true,
      topic: topic.title,
      content,
      metadata: {
        category: topic.category,
        difficulty: topic.difficulty,
        estimatedLength: topic.estimatedLength,
        generatedAt: new Date().toISOString(),
        generatedBy: session.user.email
      }
    });

  } catch (error: any) {
    console.error('❌ Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Generate content using AI (Anthropic Claude or similar)
 * This is a placeholder - you'll need to integrate with your preferred AI service
 */
async function generateContentWithAI(topic: any, customizations: any = {}) {
  const {
    includeExamples = true,
    includeFAQs = true,
    tone = 'professional',
    additionalSections = []
  } = customizations;

  // Build the prompt for AI
  const prompt = `
You are an expert financial content writer specializing in NRI (Non-Resident Indian) wealth management, tax planning, and cross-border financial services.

Generate comprehensive content for a PDF guide with the following specifications:

**Title:** ${topic.title}
**Category:** ${topic.category}
**Difficulty Level:** ${topic.difficulty}
**Target Audience:** ${topic.targetAudience.join(', ')}
**Estimated Length:** ${topic.estimatedLength}

**Required Sections:**
${topic.outline.map((section: string, index: number) => `${index + 1}. ${section}`).join('\n')}

${additionalSections.length > 0 ? `\n**Additional Requested Sections:**\n${additionalSections.join('\n')}` : ''}

**Tone:** ${tone === 'professional' ? 'Professional, authoritative, yet accessible' : tone === 'conversational' ? 'Conversational and friendly' : 'Educational and informative'}

**Content Requirements:**
- Write in clear, jargon-free language
- ${includeExamples ? 'Include practical examples and case studies' : 'Focus on principles without detailed examples'}
- ${includeFAQs ? 'Include a comprehensive FAQ section at the end' : 'Skip the FAQ section'}
- Use bullet points and tables where appropriate
- Add "⚠️ Important" callouts for critical information
- Add "💡 Pro Tip" for expert insights
- Include disclaimers where necessary
- Reference current regulations (2025)
- Cite official sources (IRS, USCIS, RBI, FEMA, etc.)

**Format:**
- Use Markdown formatting
- Include a Table of Contents
- Use ## for main sections, ### for subsections
- Format tables using Markdown table syntax
- Add horizontal rules (---) between major sections

**Compliance:**
- Include appropriate disclaimers about professional advice
- Mention consulting qualified professionals for specific situations
- Note that tax laws change and users should verify current rules
- Include "Last Updated: [Date]" at the end

Generate the complete guide content now.
  `;

  // OPTION 1: Use Google Gemini API (FREE with generous limits - RECOMMENDED!)
  if (process.env.GOOGLE_AI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 16000,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Google AI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;

    } catch (apiError) {
      console.warn('⚠️ Google AI API unavailable, trying other options...');
    }
  }

  // OPTION 2: Use Anthropic Claude API (if you have API key)
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 16000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0].text;

    } catch (apiError) {
      console.warn('⚠️ Anthropic API unavailable, using template-based generation');
      // Fallback to template
      return generateFromTemplate(topic, customizations);
    }
  }

  // OPTION 2: Use OpenAI API (if you have API key)
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [{
            role: 'system',
            content: 'You are an expert financial content writer specializing in NRI wealth management.'
          }, {
            role: 'user',
            content: prompt
          }],
          max_tokens: 16000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (apiError) {
      console.warn('⚠️ OpenAI API unavailable, using template-based generation');
      // Fallback to template
      return generateFromTemplate(topic, customizations);
    }
  }

  // OPTION 3: Fallback to template-based generation (no API key)
  return generateFromTemplate(topic, customizations);
}

/**
 * Template-based content generation (fallback if no AI API available)
 */
function generateFromTemplate(topic: any, customizations: any = {}) {
  const sections = topic.outline.map((section: string, index: number) => {
    return `
## ${index + 1}. ${section}

[This section covers ${section.toLowerCase()}]

### Key Points

- **Point 1:** [Important information about ${section.toLowerCase()}]
- **Point 2:** [Critical considerations for NRIs]
- **Point 3:** [Actionable steps or recommendations]

${customizations.includeExamples !== false ? `
### Example

**Scenario:** [Real-world example relevant to ${section.toLowerCase()}]

**Analysis:** [Detailed breakdown of the scenario]

**Takeaway:** [Key lesson from this example]
` : ''}

⚠️ **Important:** [Critical warning or compliance note]

💡 **Pro Tip:** [Expert insight or strategy]

---
    `.trim();
  });

  return `
# ${topic.title}

**Category:** ${topic.category}
**Difficulty:** ${topic.difficulty}
**Target Audience:** ${topic.targetAudience.join(', ')}
**Last Updated:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}

---

## Table of Contents

${topic.outline.map((section: string, index: number) => `${index + 1}. ${section}`).join('\n')}

---

## Introduction

This comprehensive guide covers ${topic.title.toLowerCase()}, designed specifically for ${topic.targetAudience.join(', ')}.

**Who Should Read This:**
${topic.targetAudience.map((audience: string) => `- ${audience}`).join('\n')}

**What You'll Learn:**
${topic.outline.slice(0, 5).map((section: string) => `- ${section}`).join('\n')}

---

${sections.join('\n\n')}

${customizations.includeFAQs !== false ? `
---

## Frequently Asked Questions (FAQs)

### Q1: [Common question about ${topic.title.toLowerCase()}]?

**A:** [Detailed answer with practical guidance]

### Q2: [Question about specific scenario]?

**A:** [Answer addressing the scenario with actionable steps]

### Q3: [Question about compliance or regulations]?

**A:** [Answer with regulatory references and compliance guidance]

---
` : ''}

## Resources & Next Steps

**Further Reading:**
- [Relevant government website or official resource]
- [Industry publication or research]
- [Additional guide or tool]

**Professional Help:**
Contact NRI Wealth Partners for personalized guidance on ${topic.title.toLowerCase()}.

- **Email:** consultation@nriwealthpartners.com
- **Website:** www.nriwealthpartners.com
- **Phone:** [Contact numbers]

---

## Disclaimer

This guide is for informational and educational purposes only. It does NOT constitute professional financial, tax, or legal advice.

**You should:**
- Consult qualified professionals before making decisions
- Verify current regulations and rules
- Consider your specific circumstances

**We are NOT liable for:**
- Decisions made based solely on this guide
- Errors or omissions (though we strive for accuracy)
- Changes in laws or regulations

**Always:**
- File taxes and comply with regulations on time
- Keep proper documentation
- Seek professional advice for complex situations

---

**Last Updated:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

© ${new Date().getFullYear()} NRI Wealth Partners. All rights reserved.
  `.trim();
}
