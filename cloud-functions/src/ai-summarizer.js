/**
 * AI-Powered Article Summarizer
 *
 * Uses Google Gemini AI to generate concise, NRI-focused summaries
 * for curated articles, including headlines and key takeaways.
 */

const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const db = admin.firestore();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

const BATCH_SIZE = 15; // Process 15 articles at a time

/**
 * Summarize all curated articles without summaries
 */
async function summarizeArticles() {
  console.log('✍️ Starting AI article summarization');

  const startTime = Date.now();
  let totalProcessed = 0;
  let totalSuccess = 0;
  let totalFailed = 0;

  try {
    // Get curated articles that need summaries
    const curatedSnapshot = await db
      .collection('curated_articles')
      .where('status', '==', 'draft')
      .where('summary', '==', null)
      .limit(100)
      .get();

    if (curatedSnapshot.empty) {
      console.log('✅ No articles need summarization');
      return {
        success: true,
        totalProcessed: 0,
        totalSuccess: 0,
        totalFailed: 0
      };
    }

    console.log(`📄 Found ${curatedSnapshot.size} articles to summarize`);

    // Process in batches
    const articles = curatedSnapshot.docs;

    for (let i = 0; i < articles.length; i += BATCH_SIZE) {
      const batch = articles.slice(i, i + BATCH_SIZE);

      console.log(`\n🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}...`);

      const promises = batch.map(doc => summarizeSingleArticle(doc.id, doc.data()));
      const results = await Promise.all(promises);

      totalProcessed += results.length;
      totalSuccess += results.filter(r => r.success).length;
      totalFailed += results.filter(r => !r.success).length;

      // Wait 1 second between batches to avoid rate limits
      if (i + BATCH_SIZE < articles.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    const summary = {
      success: true,
      totalProcessed,
      totalSuccess,
      totalFailed,
      successRate: ((totalSuccess / totalProcessed) * 100).toFixed(1) + '%',
      durationSeconds: duration
    };

    console.log('\n✅ Article summarization completed!');
    console.log(`   Processed: ${totalProcessed}`);
    console.log(`   Success: ${totalSuccess}`);
    console.log(`   Failed: ${totalFailed}`);
    console.log(`   Success rate: ${summary.successRate}`);
    console.log(`   Duration: ${duration}s`);

    return summary;
  } catch (error) {
    console.error('❌ Article summarization failed:', error);
    throw error;
  }
}

/**
 * Summarize a single curated article
 */
async function summarizeSingleArticle(articleId, curatedArticle) {
  try {
    // Get original raw article for full content
    const rawArticleDoc = await db
      .collection('raw_articles')
      .doc(curatedArticle.rawArticleId)
      .get();

    if (!rawArticleDoc.exists) {
      throw new Error('Raw article not found');
    }

    const rawArticle = rawArticleDoc.data();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are an expert content writer for "The NRI Weekly" newsletter, targeted at Non-Resident Indians.

Your task is to create a concise, engaging summary of the following article for NRI readers.

**Article Details:**
Original Title: ${rawArticle.title}
Source: ${rawArticle.source?.name || 'Unknown'}
Category: ${curatedArticle.category}
Content: ${rawArticle.content?.substring(0, 2000) || rawArticle.description || ''}
URL: ${rawArticle.url}

**Your Task:**
1. Write a catchy headline (max 60 characters) that appeals to NRIs
2. Write a concise summary (100-150 words) in HTML format:
   - Focus on what NRIs need to know
   - Explain the impact on NRIs specifically
   - Use simple, clear language
   - Include 1-2 key facts or numbers
   - End with a clear takeaway
3. Extract one key takeaway (single sentence)

**Tone:**
- Professional but conversational
- Focus on practical implications
- Avoid jargon
- Emphasize relevance to NRIs

**Response Format (JSON only):**
{
  "headline": "<catchy headline, max 60 chars>",
  "summary": "<HTML formatted summary, 100-150 words>",
  "keyTakeaway": "<single sentence takeaway>"
}

**HTML Guidelines for summary:**
- Use <p> for paragraphs
- Use <strong> for emphasis on key points
- Use <a href="url"> for links (if needed)
- Keep it simple, clean HTML

Respond ONLY with valid JSON. No markdown, no explanations.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse AI response
    let aiResult;
    try {
      const cleanedResponse = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      aiResult = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error(`❌ Failed to parse AI summary for ${articleId}:`, response);
      throw new Error('Invalid AI response format');
    }

    // Validate headline length
    if (aiResult.headline.length > 60) {
      aiResult.headline = aiResult.headline.substring(0, 57) + '...';
    }

    // Update curated article with summary
    await db.collection('curated_articles').doc(articleId).update({
      headline: aiResult.headline,
      summary: aiResult.summary,
      keyTakeaway: aiResult.keyTakeaway,
      'aiMetadata.generatedAt': admin.firestore.FieldValue.serverTimestamp(),
      'aiMetadata.model': 'gemini-2.0-flash-exp',
      'aiMetadata.promptVersion': '1.0'
    });

    console.log(`  ✅ Summarized: ${aiResult.headline}`);

    return {
      articleId,
      success: true,
      headline: aiResult.headline
    };
  } catch (error) {
    console.error(`❌ Error summarizing article ${articleId}:`, error.message);

    // Update with error status
    await db.collection('curated_articles').doc(articleId).update({
      status: 'rejected',
      'aiMetadata.error': error.message
    });

    return {
      articleId,
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  summarizeArticles,
  summarizeSingleArticle
};
