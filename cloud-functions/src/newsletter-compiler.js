/**
 * Newsletter Compiler
 *
 * Compiles weekly newsletter from curated articles using AI to select
 * the best articles for each category and generate intro/outro text.
 */

const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const db = admin.firestore();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

/**
 * Compile weekly newsletter
 */
async function compileNewsletter() {
  console.log('📰 Starting newsletter compilation');

  try {
    // Calculate week range (previous Monday to Sunday)
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const lastMonday = new Date(weekAgo);
    lastMonday.setDate(weekAgo.getDate() - ((weekAgo.getDay() + 6) % 7));
    lastMonday.setHours(0, 0, 0, 0);

    const lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6);
    lastSunday.setHours(23, 59, 59, 999);

    console.log(`📅 Compiling newsletter for week: ${lastMonday.toDateString()} - ${lastSunday.toDateString()}`);

    // Get curated articles from last week
    const articlesSnapshot = await db
      .collection('curated_articles')
      .where('status', '==', 'draft')
      .where('createdAt', '>=', lastMonday)
      .where('createdAt', '<=', lastSunday)
      .orderBy('createdAt', 'desc')
      .orderBy('aiMetadata.relevanceScore', 'desc')
      .get();

    if (articlesSnapshot.empty) {
      console.log('⚠️ No curated articles found for this week');
      return {
        success: false,
        message: 'No articles available for newsletter'
      };
    }

    console.log(`📚 Found ${articlesSnapshot.size} curated articles`);

    // Group articles by category
    const articlesByCategory = {
      success: [],
      regulatory: [],
      financial: [],
      community: []
    };

    articlesSnapshot.docs.forEach(doc => {
      const article = { id: doc.id, ...doc.data() };
      if (articlesByCategory[article.category]) {
        articlesByCategory[article.category].push(article);
      }
    });

    console.log('\n📊 Articles by category:');
    Object.entries(articlesByCategory).forEach(([category, articles]) => {
      console.log(`   ${category}: ${articles.length} articles`);
    });

    // Select top articles for each category (max 3 per category)
    const selectedArticles = {
      success: articlesByCategory.success.slice(0, 3),
      regulatory: articlesByCategory.regulatory.slice(0, 3),
      financial: articlesByCategory.financial.slice(0, 3),
      community: articlesByCategory.community.slice(0, 3)
    };

    // Generate subject line suggestions with AI
    const subjectLines = await generateSubjectLines(selectedArticles, lastMonday);

    // Generate opening and closing text
    const { opening, closing } = await generateIntroOutro(selectedArticles, lastMonday);

    // Get next issue number
    const lastNewsletter = await db
      .collection('newsletters')
      .orderBy('issueNumber', 'desc')
      .limit(1)
      .get();

    const nextIssueNumber = lastNewsletter.empty ? 1 : lastNewsletter.docs[0].data().issueNumber + 1;

    // Create newsletter document
    const newsletterRef = await db.collection('newsletters').add({
      issueNumber: nextIssueNumber,
      title: `The NRI Weekly - ${lastMonday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      status: 'pending_review',

      subjectLine: subjectLines[0], // Default to first suggestion
      subjectLineSuggestions: subjectLines,
      previewText: opening.substring(0, 100).replace(/<[^>]*>/g, ''),

      content: {
        opening,
        sections: {
          success: {
            title: '🌟 Success Stories',
            articles: selectedArticles.success.map(a => a.id)
          },
          regulatory: {
            title: '📋 Regulatory Updates',
            articles: selectedArticles.regulatory.map(a => a.id)
          },
          financial: {
            title: '💰 Financial Insights',
            articles: selectedArticles.financial.map(a => a.id)
          },
          community: {
            title: '🌏 Community News',
            articles: selectedArticles.community.map(a => a.id)
          },
          expert: {
            title: '💡 Expert Tip',
            content: '' // To be filled by admin
          }
        },
        closing,
        adminCommentary: '' // To be filled by admin
      },

      weekStartDate: admin.firestore.Timestamp.fromDate(lastMonday),
      weekEndDate: admin.firestore.Timestamp.fromDate(lastSunday),

      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: 'ai_agent',

      reviewedBy: null,
      reviewedAt: null,
      scheduledFor: null,
      sentAt: null,

      stats: {
        totalRecipients: 0,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
        openRate: 0,
        clickRate: 0
      },

      aiGenerated: true,
      aiMetadata: {
        model: 'gemini-2.0-flash-exp',
        generatedAt: admin.firestore.FieldValue.serverTimestamp(),
        promptVersion: '1.0'
      }
    });

    // Mark articles as used in this newsletter
    const batch = db.batch();
    Object.values(selectedArticles).flat().forEach(article => {
      const articleRef = db.collection('curated_articles').doc(article.id);
      batch.update(articleRef, {
        status: 'approved',
        usedInNewsletters: admin.firestore.FieldValue.arrayUnion(newsletterRef.id)
      });
    });
    await batch.commit();

    console.log(`\n✅ Newsletter #${nextIssueNumber} compiled successfully!`);
    console.log(`   Newsletter ID: ${newsletterRef.id}`);
    console.log(`   Total articles: ${Object.values(selectedArticles).flat().length}`);
    console.log(`   Status: pending_review`);

    return {
      success: true,
      newsletterId: newsletterRef.id,
      issueNumber: nextIssueNumber,
      totalArticles: Object.values(selectedArticles).flat().length,
      articlesByCategory: Object.fromEntries(
        Object.entries(selectedArticles).map(([cat, arts]) => [cat, arts.length])
      )
    };
  } catch (error) {
    console.error('❌ Newsletter compilation failed:', error);
    throw error;
  }
}

/**
 * Generate subject line suggestions with AI
 */
async function generateSubjectLines(articles, weekDate) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const topArticles = Object.values(articles)
    .flat()
    .slice(0, 5)
    .map(a => `- ${a.headline}`)
    .join('\n');

  const prompt = `You are writing subject lines for "The NRI Weekly" newsletter.

**This Week's Top Stories:**
${topArticles}

**Week:** ${weekDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

Generate 3 compelling email subject lines (max 60 characters each) that:
1. Capture the most newsworthy story
2. Create urgency or curiosity
3. Appeal to NRI readers
4. Are concise and action-oriented

**Examples of good subject lines:**
- "New FEMA rules impact your NRE account"
- "Indian markets hit record high - what it means for NRIs"
- "Tax deadlines approaching: Are you compliant?"

**Response Format (JSON only):**
{
  "subjectLines": [
    "Subject line 1",
    "Subject line 2",
    "Subject line 3"
  ]
}

Respond ONLY with valid JSON.`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  try {
    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const aiResult = JSON.parse(cleanedResponse);
    return aiResult.subjectLines;
  } catch (error) {
    console.error('Failed to parse subject lines:', error);
    return [
      `The NRI Weekly - ${weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      'Your weekly NRI news digest',
      'This week in NRI news'
    ];
  }
}

/**
 * Generate opening and closing text with AI
 */
async function generateIntroOutro(articles, weekDate) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const totalArticles = Object.values(articles).flat().length;

  const prompt = `You are the editor of "The NRI Weekly" newsletter.

Write a brief opening and closing for this week's newsletter.

**Week:** ${weekDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
**Total Articles:** ${totalArticles}

**Opening (50 words):**
- Warm, welcoming tone
- Mention week date
- Tease the content
- Make readers excited to read

**Closing (30 words):**
- Thank readers
- Encourage engagement
- Include call-to-action to visit website or schedule consultation

**Response Format (JSON only):**
{
  "opening": "<HTML formatted opening, ~50 words>",
  "closing": "<HTML formatted closing, ~30 words>"
}

Use <p> tags for paragraphs. Keep it concise and friendly.

Respond ONLY with valid JSON.`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  try {
    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const aiResult = JSON.parse(cleanedResponse);
    return aiResult;
  } catch (error) {
    console.error('Failed to parse intro/outro:', error);
    return {
      opening: `<p>Welcome to this week's edition of The NRI Weekly! We've curated ${totalArticles} important stories covering success stories, regulatory updates, financial insights, and community news.</p>`,
      closing: '<p>Thank you for reading! Have questions? Schedule a free consultation at <a href="https://nriwealthpartners.com">nriwealthpartners.com</a></p>'
    };
  }
}

module.exports = {
  compileNewsletter,
  generateSubjectLines,
  generateIntroOutro
};
