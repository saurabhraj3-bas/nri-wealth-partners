/**
 * Chatbot Analytics System
 * Analyzes conversation patterns and generates business insights
 */

export interface ConversationRecord {
  timestamp: string
  userEmail: string
  userMessage: string
  aiResponse: string
  conversationLength: number
  serviceMentioned?: string[]
  intent?: string
}

export interface AnalyticsInsights {
  totalConversations: number
  uniqueUsers: number
  averageMessagesPerConversation: number
  topQuestions: { question: string; count: number }[]
  popularServices: { service: string; count: number }[]
  userIntents: { intent: string; count: number }[]
  peakHours: { hour: number; count: number }[]
  leadQuality: {
    highIntent: number
    mediumIntent: number
    lowIntent: number
  }
}

// Service keywords for tracking - Journey-Based Grouping
const SERVICE_KEYWORDS = {
  // Building Wealth
  'Building Wealth - NRI Investment': ['invest', 'investment', 'wealth management', 'grow wealth'],
  'Building Wealth - Mutual Funds': ['mutual fund', 'mf', 'sip', 'systematic investment'],
  'Building Wealth - Portfolio Management': ['portfolio', 'asset allocation', 'diversification', 'portfolio review'],

  // Specialized Solutions
  'Specialized - GIFT City': ['gift city', 'ifsc', 'offshore', 'gift nifty'],
  'Specialized - Virtual Family Office': ['family office', 'virtual office', 'comprehensive wealth', 'concierge'],

  // Regulatory & Tax
  'Regulatory & Tax - Tax Planning': ['tax', 'taxation', 'deduction', 'filing', 'tax return', 'tax optimization'],
  'Regulatory & Tax - Compliance': ['fema', 'fatca', 'crs', 'compliance', 'regulation', 'rbi', 'foreign exchange'],

  // Life Transitions
  'Life Transitions - Moving Back': ['moving back', 'return to india', 'relocation', 'rnor', 'repatriation'],
  'Life Transitions - Retirement': ['retirement', 'pension', 'retire', 'post-retirement'],
  'Life Transitions - Estate Planning': ['estate', 'will', 'inheritance', 'succession', 'legacy'],
}

// Intent classification
const INTENT_KEYWORDS = {
  'High Intent - Ready to Invest': ['ready to invest', 'want to start', 'how to begin', 'schedule', 'consultation'],
  'Medium Intent - Exploring': ['tell me about', 'what is', 'how does', 'explain'],
  'Low Intent - General Inquiry': ['curious', 'just looking', 'information'],
}

export function analyzeConversation(userMessage: string, aiResponse: string): {
  services: string[]
  intent: string
} {
  const messageLower = userMessage.toLowerCase()
  const services: string[] = []
  let intent = 'General Inquiry'

  // Detect services mentioned
  for (const [service, keywords] of Object.entries(SERVICE_KEYWORDS)) {
    if (keywords.some(keyword => messageLower.includes(keyword))) {
      services.push(service)
    }
  }

  // Detect user intent
  for (const [intentType, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some(keyword => messageLower.includes(keyword))) {
      intent = intentType
      break
    }
  }

  return { services, intent }
}

export function generateInsightsHTML(records: ConversationRecord[]): string {
  const insights = calculateInsights(records)

  return `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #1e3a8a; border-bottom: 3px solid #d4af37; padding-bottom: 10px; }
        h2 { color: #1e3a8a; margin-top: 30px; }
        .metric { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .metric-value { font-size: 32px; font-weight: bold; color: #1e3a8a; }
        .metric-label { font-size: 14px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #1e3a8a; color: white; }
        tr:hover { background: #f5f5f5; }
        .high { color: #16a34a; font-weight: bold; }
        .medium { color: #ea580c; }
        .low { color: #6b7280; }
        .chart-bar { background: #d4af37; height: 20px; display: inline-block; }
      </style>
    </head>
    <body>
      <h1>📊 NRI Wealth Partners - Chatbot Analytics Report</h1>
      <p><strong>Report Period:</strong> ${new Date(records[0]?.timestamp || Date.now()).toLocaleDateString()} - ${new Date(records[records.length - 1]?.timestamp || Date.now()).toLocaleDateString()}</p>

      <h2>📈 Key Metrics</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
        <div class="metric">
          <div class="metric-value">${insights.totalConversations}</div>
          <div class="metric-label">Total Conversations</div>
        </div>
        <div class="metric">
          <div class="metric-value">${insights.uniqueUsers}</div>
          <div class="metric-label">Unique Users</div>
        </div>
        <div class="metric">
          <div class="metric-value">${insights.averageMessagesPerConversation.toFixed(1)}</div>
          <div class="metric-label">Avg Messages/Chat</div>
        </div>
      </div>

      <h2>🎯 Lead Quality Distribution</h2>
      <table>
        <tr>
          <th>Intent Level</th>
          <th>Count</th>
          <th>Percentage</th>
        </tr>
        <tr>
          <td class="high">High Intent - Ready to Invest</td>
          <td>${insights.leadQuality.highIntent}</td>
          <td>${((insights.leadQuality.highIntent / insights.totalConversations) * 100).toFixed(1)}%</td>
        </tr>
        <tr>
          <td class="medium">Medium Intent - Exploring</td>
          <td>${insights.leadQuality.mediumIntent}</td>
          <td>${((insights.leadQuality.mediumIntent / insights.totalConversations) * 100).toFixed(1)}%</td>
        </tr>
        <tr>
          <td class="low">Low Intent - General Inquiry</td>
          <td>${insights.leadQuality.lowIntent}</td>
          <td>${((insights.leadQuality.lowIntent / insights.totalConversations) * 100).toFixed(1)}%</td>
        </tr>
      </table>

      <h2>💼 Most Popular Services</h2>
      <table>
        <tr>
          <th>Service</th>
          <th>Inquiries</th>
          <th>Visual</th>
        </tr>
        ${insights.popularServices.slice(0, 5).map(service => `
          <tr>
            <td>${service.service}</td>
            <td>${service.count}</td>
            <td><span class="chart-bar" style="width: ${(service.count / insights.popularServices[0].count) * 200}px;"></span></td>
          </tr>
        `).join('')}
      </table>

      <h2>❓ Top Questions Asked</h2>
      <table>
        <tr>
          <th>#</th>
          <th>Question</th>
          <th>Times Asked</th>
        </tr>
        ${insights.topQuestions.slice(0, 10).map((q, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${q.question}</td>
            <td>${q.count}</td>
          </tr>
        `).join('')}
      </table>

      <h2>⏰ Peak Usage Hours</h2>
      <table>
        <tr>
          <th>Time</th>
          <th>Conversations</th>
          <th>Activity</th>
        </tr>
        ${insights.peakHours.slice(0, 5).map(hour => `
          <tr>
            <td>${hour.hour}:00 - ${hour.hour + 1}:00</td>
            <td>${hour.count}</td>
            <td><span class="chart-bar" style="width: ${(hour.count / insights.peakHours[0].count) * 150}px;"></span></td>
          </tr>
        `).join('')}
      </table>

      <h2>💡 Key Insights & Recommendations</h2>
      <div class="metric">
        ${generateRecommendations(insights)}
      </div>

      <hr style="margin: 40px 0;">
      <p style="color: #666; font-size: 12px;">
        This report was automatically generated by the NRI Wealth Partners AI Chatbot Analytics System.
        Data is based on ${insights.totalConversations} conversations from ${insights.uniqueUsers} unique users.
      </p>
    </body>
    </html>
  `
}

function calculateInsights(records: ConversationRecord[]): AnalyticsInsights {
  const uniqueUsers = new Set(records.map(r => r.userEmail)).size
  const totalMessages = records.reduce((sum, r) => sum + r.conversationLength, 0)

  // Count questions
  const questionCounts = new Map<string, number>()
  records.forEach(r => {
    const normalized = r.userMessage.toLowerCase().trim()
    questionCounts.set(normalized, (questionCounts.get(normalized) || 0) + 1)
  })

  const topQuestions = Array.from(questionCounts.entries())
    .map(([question, count]) => ({ question, count }))
    .sort((a, b) => b.count - a.count)

  // Count services
  const serviceCounts = new Map<string, number>()
  records.forEach(r => {
    r.serviceMentioned?.forEach(service => {
      serviceCounts.set(service, (serviceCounts.get(service) || 0) + 1)
    })
  })

  const popularServices = Array.from(serviceCounts.entries())
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count)

  // Analyze peak hours
  const hourCounts = new Map<number, number>()
  records.forEach(r => {
    const hour = new Date(r.timestamp).getHours()
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1)
  })

  const peakHours = Array.from(hourCounts.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)

  // Lead quality
  let highIntent = 0, mediumIntent = 0, lowIntent = 0
  records.forEach(r => {
    if (r.intent?.includes('High Intent')) highIntent++
    else if (r.intent?.includes('Medium Intent')) mediumIntent++
    else lowIntent++
  })

  return {
    totalConversations: records.length,
    uniqueUsers,
    averageMessagesPerConversation: totalMessages / records.length,
    topQuestions,
    popularServices,
    userIntents: [],
    peakHours,
    leadQuality: { highIntent, mediumIntent, lowIntent }
  }
}

function generateRecommendations(insights: AnalyticsInsights): string {
  const recommendations: string[] = []

  // High intent analysis
  if (insights.leadQuality.highIntent > insights.totalConversations * 0.3) {
    recommendations.push('✅ <strong>High Conversion Potential:</strong> ' + insights.leadQuality.highIntent + ' users showed high purchase intent. Follow up within 24 hours!')
  }

  // Popular services
  if (insights.popularServices.length > 0) {
    recommendations.push(`📈 <strong>Top Service Interest:</strong> ${insights.popularServices[0].service} is generating the most inquiries. Consider creating targeted content.`)
  }

  // Peak hours
  if (insights.peakHours.length > 0) {
    recommendations.push(`⏰ <strong>Optimal Response Time:</strong> Most conversations happen around ${insights.peakHours[0].hour}:00. Ensure team availability during these hours.`)
  }

  // Top questions
  if (insights.topQuestions.length > 0) {
    recommendations.push(`❓ <strong>FAQ Opportunity:</strong> "${insights.topQuestions[0].question}" was asked ${insights.topQuestions[0].count} times. Add to your FAQ page.`)
  }

  return recommendations.map(r => `<p>${r}</p>`).join('')
}
