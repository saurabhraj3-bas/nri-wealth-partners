/**
 * Newsletter Helper Functions
 *
 * Server-side functions to fetch newsletter data from Firestore
 * with comprehensive error handling.
 */

import { getFirestoreDb } from './firebase-admin';

export interface Newsletter {
  id: string;
  issueNumber: number;
  title: string;
  status: 'draft' | 'pending_review' | 'approved' | 'scheduled' | 'sent';
  subjectLine: string;
  previewText: string;
  content: {
    opening: string;
    sections: {
      success: { title: string; articles: string[] };
      regulatory: { title: string; articles: string[] };
      financial: { title: string; articles: string[] };
      community: { title: string; articles: string[] };
      expert?: { title: string; content: string };
    };
    closing: string;
    adminCommentary?: string;
  };
  weekStartDate: any;
  weekEndDate: any;
  sentAt: any;
  stats?: {
    totalRecipients: number;
    sent: number;
    opened: number;
    clicked: number;
    openRate: number;
    clickRate: number;
  };
}

export interface CuratedArticle {
  id: string;
  category: 'success' | 'regulatory' | 'financial' | 'community';
  headline: string;
  summary: string;
  keyTakeaway: string;
  originalArticle: {
    title: string;
    url: string;
    source: string;
    publishedAt: any;
  };
  aiMetadata: {
    relevanceScore: number;
    generatedAt: any;
    model: string;
  };
  status: 'draft' | 'approved' | 'published' | 'rejected';
  createdAt: any;
}

/**
 * Get all sent newsletters (for public archive)
 */
export async function getPublishedNewsletters(
  limit: number = 10
): Promise<Newsletter[]> {
  try {
    const db = getFirestoreDb();

    const snapshot = await db
      .collection('newsletters')
      .where('status', '==', 'sent')
      .orderBy('sentAt', 'desc')
      .limit(limit)
      .get();

    if (snapshot.empty) {
      return [];
    }

    const newsletters = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Newsletter[];

    return newsletters;
  } catch (error) {
    console.error('❌ Error fetching published newsletters:', error);

    // Return empty array instead of throwing to prevent page crash
    return [];
  }
}

/**
 * Get single newsletter by ID
 */
export async function getNewsletterById(
  newsletterId: string
): Promise<Newsletter | null> {
  try {
    const db = getFirestoreDb();

    const doc = await db.collection('newsletters').doc(newsletterId).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data()
    } as Newsletter;
  } catch (error) {
    console.error(`❌ Error fetching newsletter ${newsletterId}:`, error);
    return null;
  }
}

/**
 * Get newsletter by issue number
 */
export async function getNewsletterByIssue(
  issueNumber: number
): Promise<Newsletter | null> {
  try {
    const db = getFirestoreDb();

    const snapshot = await db
      .collection('newsletters')
      .where('issueNumber', '==', issueNumber)
      .where('status', '==', 'sent')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Newsletter;
  } catch (error) {
    console.error(`❌ Error fetching newsletter issue ${issueNumber}:`, error);
    return null;
  }
}

/**
 * Get curated article by ID
 */
export async function getCuratedArticle(
  articleId: string
): Promise<CuratedArticle | null> {
  try {
    const db = getFirestoreDb();

    const doc = await db.collection('curated_articles').doc(articleId).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data()
    } as CuratedArticle;
  } catch (error) {
    console.error(`❌ Error fetching article ${articleId}:`, error);
    return null;
  }
}

/**
 * Get multiple curated articles by IDs
 */
export async function getCuratedArticles(
  articleIds: string[]
): Promise<CuratedArticle[]> {
  try {
    if (!articleIds || articleIds.length === 0) {
      return [];
    }

    const db = getFirestoreDb();

    // Firestore 'in' query supports max 10 items
    // If more than 10, need to batch
    const batchSize = 10;
    const batches: string[][] = [];

    for (let i = 0; i < articleIds.length; i += batchSize) {
      batches.push(articleIds.slice(i, i + batchSize));
    }

    const allArticles: CuratedArticle[] = [];

    for (const batch of batches) {
      const snapshot = await db
        .collection('curated_articles')
        .where('__name__', 'in', batch)
        .get();

      const articles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CuratedArticle[];

      allArticles.push(...articles);
    }

    // Maintain original order
    const articleMap = new Map(allArticles.map(a => [a.id, a]));
    return articleIds.map(id => articleMap.get(id)).filter(Boolean) as CuratedArticle[];
  } catch (error) {
    console.error('❌ Error fetching curated articles:', error);
    return [];
  }
}

/**
 * Get recent curated articles (for homepage widget)
 */
export async function getRecentArticles(
  limit: number = 6
): Promise<CuratedArticle[]> {
  try {
    const db = getFirestoreDb();

    const snapshot = await db
      .collection('curated_articles')
      .where('status', '==', 'approved')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CuratedArticle[];
  } catch (error) {
    console.error('❌ Error fetching recent articles:', error);
    return [];
  }
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(
  category: 'success' | 'regulatory' | 'financial' | 'community',
  limit: number = 10
): Promise<CuratedArticle[]> {
  try {
    const db = getFirestoreDb();

    const snapshot = await db
      .collection('curated_articles')
      .where('category', '==', category)
      .where('status', '==', 'approved')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CuratedArticle[];
  } catch (error) {
    console.error(`❌ Error fetching ${category} articles:`, error);
    return [];
  }
}

/**
 * Format date for display
 */
export function formatNewsletterDate(timestamp: any): string {
  try {
    if (!timestamp) return 'Unknown date';

    // Firestore Timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('❌ Error formatting date:', error);
    return 'Unknown date';
  }
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: string): string {
  const categoryMap: Record<string, string> = {
    success: 'Success Stories',
    regulatory: 'Regulatory Updates',
    financial: 'Financial Insights',
    community: 'Community News'
  };

  return categoryMap[category] || category;
}

/**
 * Get category icon
 */
export function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    success: '🌟',
    regulatory: '📋',
    financial: '💰',
    community: '🌏'
  };

  return iconMap[category] || '📰';
}

/**
 * Get category color (for badges)
 */
export function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    success: 'bg-green-100 text-green-800',
    regulatory: 'bg-blue-100 text-blue-800',
    financial: 'bg-gold/20 text-yellow-800',
    community: 'bg-purple-100 text-purple-800'
  };

  return colorMap[category] || 'bg-gray-100 text-gray-800';
}

/**
 * Generate article slug from headline
 */
export function generateArticleSlug(headline: string): string {
  return headline
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

/**
 * Get newsletter stats summary
 */
export function getNewsletterStatsSummary(newsletter: Newsletter): string {
  try {
    if (!newsletter.stats) {
      return 'No stats available';
    }

    const { sent, opened, clicked, openRate, clickRate } = newsletter.stats;

    return `Sent to ${sent.toLocaleString()} subscribers • ${openRate}% opened • ${clickRate}% clicked`;
  } catch (error) {
    return 'Stats unavailable';
  }
}
