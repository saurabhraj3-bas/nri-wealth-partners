/**
 * AI-Powered Article Filter
 *
 * Uses Google Gemini AI to filter raw articles for relevance to NRI audience.
 * Scores each article from 0-10 and rejects articles below threshold (7).
 */

const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const db = admin.firestore();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

const RELEVANCE_THRESHOLD = 7;
const BATCH_SIZE = 20; // Process 20 articles at a time

/**
 * Filter all unprocessed articles
 */
async function filterArticles() {
  console.log('🔍 Starting AI article filtering');

  const startTime = Date.now();
  let totalProcessed = 0;
  let totalAccepted = 0;
  let totalRejected = 0;

  try {
    // Get unprocessed articles
    const unprocessedSnapshot = await db
      .collection('raw_articles')
      .where('processed', '==', false)
      .limit(100) // Process max 100 per run
      .get();

    if (unprocessedSnapshot.empty) {
      console.log('✅ No unprocessed articles found');
      return {
        success: true,
        totalProcessed: 0,
        totalAccepted: 0,
        totalRejected: 0
      };
    }

    console.log(`📄 Found ${unprocessedSnapshot.size} unprocessed articles`);

    // Process in batches to avoid rate limits
    const articles = unprocessedSnapshot.docs;

    for (let i = 0; i < articles.length; i += BATCH_SIZE) {
      const batch = articles.slice(i, i + BATCH_SIZE);

      console.log(`\n🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}...`);

      const promises = batch.map(doc => filterSingleArticle(doc.id, doc.data()));
      const results = await Promise.all(promises);

      totalProcessed += results.length;
      totalAccepted += results.filter(r => r.accepted).length;
      totalRejected += results.filter(r => !r.accepted).length;

      // Wait 1 second between batches to avoid rate limits
      if (i + BATCH_SIZE < articles.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    const summary = {
      success: true,
      totalProcessed,
      totalAccepted,
      totalRejected,
      acceptanceRate: ((totalAccepted / totalProcessed) * 100).toFixed(1) + '%',
      durationSeconds: duration
    };

    console.log('\n✅ Article filtering completed!');
    console.log(`   Processed: ${totalProcessed}`);
    console.log(`   Accepted: ${totalAccepted}`);
    console.log(`   Rejected: ${totalRejected}`);
    console.log(`   Acceptance rate: ${summary.acceptanceRate}`);
    console.log(`   Duration: ${duration}s`);

    return summary;
  } catch (error) {
    console.error('❌ Article filtering failed:', error);
    throw error;
  }
}

/**
 * Filter a single article with AI
 */
async function filterSingleArticle(articleId, article) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are an expert content curator for a newsletter targeting Non-Resident Indians (NRIs).

Your task is to evaluate if the following article is relevant and valuable for NRI readers.

**NRI Audience Profile:**
- Indian citizens living abroad (USA, UK, UAE, Singapore, Canada, Australia, etc.)
- Interested in: Indian economy, NRI regulations, investment opportunities, tax compliance, FEMA/FATCA, success stories, Indian markets, moving back to India, retirement planning
- NOT interested in: Pure domestic India news (unless it affects NRIs), local politics, entertainment gossip, sports (unless Indian achievement)

**Article Details:**
Title: ${article.title}
Source: ${article.source?.name || 'Unknown'}
Category: ${article.source?.category || 'Unknown'}
Description: ${article.description?.substring(0, 500) || ''}
Content: ${article.content?.substring(0, 1000) || ''}

**Evaluation Criteria:**
1. **Relevance** (0-10): How relevant is this to NRIs?
   - 9-10: Directly impacts NRIs (FEMA rules, NRI taxation, OCI/PIO, NRE/NRO accounts, etc.)
   - 7-8: High interest for NRIs (Indian economy, major policy changes, NRI success stories, investment opportunities)
   - 5-6: Moderate interest (General India business news, global Indian community news)
   - 3-4: Low interest (Domestic India news with minimal NRI impact)
   - 0-2: Not relevant (Pure local news, entertainment, sports results)

2. **Quality**: Is the article well-written and informative?
3. **Timeliness**: Is this recent and newsworthy?
4. **Actionability**: Can NRIs act on this information?

**Response Format (JSON only):**
{
  "relevanceScore": <number 0-10>,
  "category": "<success|regulatory|financial|community>",
  "reasoning": "<brief 1-sentence explanation>",
  "keyTakeaway": "<one sentence summary for NRIs>",
  "recommended": <true if score >= 7, else false>
}

Respond ONLY with valid JSON. No markdown, no explanations.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse AI response
    let aiResult;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      aiResult = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error(`❌ Failed to parse AI response for ${articleId}:`, response);
      throw new Error('Invalid AI response format');
    }

    const isAccepted = aiResult.relevanceScore >= RELEVANCE_THRESHOLD;

    // Update raw article with AI filter result
    await db.collection('raw_articles').doc(articleId).update({
      processed: true,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      aiFilterResult: {
        relevanceScore: aiResult.relevanceScore,
        category: aiResult.category,
        reasoning: aiResult.reasoning,
        rejected: !isAccepted
      }
    });

    // If accepted, create curated article (will be summarized later)
    if (isAccepted) {
      await db.collection('curated_articles').add({
        rawArticleId: articleId,
        category: aiResult.category,
        headline: null, // Will be generated during summarization
        summary: null, // Will be generated during summarization
        keyTakeaway: aiResult.keyTakeaway,
        originalArticle: {
          title: article.title,
          url: article.url,
          source: article.source?.name || 'Unknown',
          publishedAt: article.publishedAt
        },
        aiMetadata: {
          relevanceScore: aiResult.relevanceScore,
          generatedAt: admin.firestore.FieldValue.serverTimestamp(),
          model: 'gemini-2.0-flash-exp',
          promptVersion: '1.0'
        },
        status: 'draft',
        usedInNewsletters: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        approvedBy: null,
        approvedAt: null
      });

      console.log(`  ✅ Accepted: ${article.title} (score: ${aiResult.relevanceScore})`);
    } else {
      console.log(`  ❌ Rejected: ${article.title} (score: ${aiResult.relevanceScore})`);
    }

    return {
      articleId,
      accepted: isAccepted,
      score: aiResult.relevanceScore,
      category: aiResult.category
    };
  } catch (error) {
    console.error(`❌ Error filtering article ${articleId}:`, error.message);

    // Mark as processed even if failed (to avoid reprocessing)
    await db.collection('raw_articles').doc(articleId).update({
      processed: true,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      aiFilterResult: {
        relevanceScore: 0,
        category: 'error',
        reasoning: `Error: ${error.message}`,
        rejected: true
      }
    });

    return {
      articleId,
      accepted: false,
      score: 0,
      category: 'error'
    };
  }
}

module.exports = {
  filterArticles,
  filterSingleArticle
};
