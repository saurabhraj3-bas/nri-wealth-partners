/**
 * Content Calendar Strategy
 * Aligned with DIGITAL_MARKETING_STRATEGY.md
 *
 * Goals:
 * - 3 blog posts/week (12/month)
 * - 4 pillar content guides (5,000+ words)
 * - 5-10 initial PDF resources
 * - SEO-optimized for target keywords
 * - Seasonal alignment (tax season, investment cycles)
 */

export interface StrategicContent {
  id: string;
  title: string;
  contentType: 'blog-post' | 'pillar-content' | 'pdf-guide' | 'checklist' | 'case-study';
  wordCount: string;
  season: 'tax-season' | 'investment-focus' | 'immigration-focus' | 'year-round';
  publishMonth: string; // e.g., "January", "Q1", "Year-round"
  priority: 'critical' | 'high' | 'medium' | 'low';

  // SEO Optimization
  primaryKeyword: string;
  secondaryKeywords: string[];
  metaTitle: string;
  metaDescription: string;
  targetSearchVolume: string;

  // Digital Marketing Alignment
  contentPillar: 'tax' | 'investment' | 'immigration' | 'estate' | 'retirement';
  targetPersona: string[];
  userIntent: 'informational' | 'transactional' | 'navigational' | 'commercial';
  funnelStage: 'awareness' | 'consideration' | 'decision';

  // Repurposing Strategy
  canRepurpose: {
    newsletterSection: boolean;
    socialMediaPosts: boolean;
    webinarTopic: boolean;
    emailSequence: boolean;
    infographic: boolean;
  };

  // Performance Tracking
  estimatedTrafficPotential: 'high' | 'medium' | 'low';
  conversionPotential: 'high' | 'medium' | 'low';
  linkBuildingValue: 'high' | 'medium' | 'low';
}

export const strategicContentPlan: StrategicContent[] = [
  // TAX SEASON FOCUS (January - April)
  {
    id: 'tax-jan-001',
    title: '2025 NRI Tax Filing Deadlines You Can\'t Miss',
    contentType: 'blog-post',
    wordCount: '1,500-2,000',
    season: 'tax-season',
    publishMonth: 'January',
    priority: 'critical',
    primaryKeyword: 'NRI tax filing deadlines 2025',
    secondaryKeywords: ['ITR deadline', 'FBAR deadline', 'tax calendar NRI'],
    metaTitle: '2025 NRI Tax Filing Deadlines: Complete Calendar [India, USA, UK, Canada]',
    metaDescription: 'Don\'t miss critical tax deadlines! Complete 2025 calendar for NRIs covering India ITR, US FBAR, UK Self Assessment, and Canada T1 deadlines with penalties explained.',
    targetSearchVolume: '5,000-10,000/month',
    contentPillar: 'tax',
    targetPersona: ['USA NRIs', 'UK NRIs', 'Canada NRIs', 'All NRIs'],
    userIntent: 'informational',
    funnelStage: 'awareness',
    canRepurpose: {
      newsletterSection: true,
      socialMediaPosts: true,
      webinarTopic: true,
      emailSequence: true,
      infographic: true
    },
    estimatedTrafficPotential: 'high',
    conversionPotential: 'high',
    linkBuildingValue: 'medium'
  },
  {
    id: 'tax-jan-002',
    title: 'FBAR Reporting Requirements for NRIs',
    contentType: 'blog-post',
    wordCount: '2,000-2,500',
    season: 'tax-season',
    publishMonth: 'January',
    priority: 'critical',
    primaryKeyword: 'FBAR requirements NRI',
    secondaryKeywords: ['FinCEN 114', 'foreign bank account reporting', 'FBAR penalties'],
    metaTitle: 'FBAR Requirements 2025: Complete Guide for NRIs with Indian Accounts',
    metaDescription: 'NRIs with >$10K in foreign accounts must file FBAR. Learn requirements, process, deadlines, and avoid penalties up to $100K. Step-by-step filing guide.',
    targetSearchVolume: '2,000-5,000/month',
    contentPillar: 'tax',
    targetPersona: ['USA NRIs'],
    userIntent: 'informational',
    funnelStage: 'consideration',
    canRepurpose: {
      newsletterSection: true,
      socialMediaPosts: true,
      webinarTopic: true,
      emailSequence: true,
      infographic: false
    },
    estimatedTrafficPotential: 'high',
    conversionPotential: 'high',
    linkBuildingValue: 'high'
  },
  {
    id: 'tax-feb-001',
    title: 'How to Claim Foreign Tax Credit as NRI',
    contentType: 'blog-post',
    wordCount: '1,800-2,200',
    season: 'tax-season',
    publishMonth: 'February',
    priority: 'high',
    primaryKeyword: 'foreign tax credit NRI',
    secondaryKeywords: ['Form 1116', 'DTAA tax credit', 'avoid double taxation'],
    metaTitle: 'Foreign Tax Credit for NRIs: Avoid Double Taxation (2025 Guide)',
    metaDescription: 'Learn how to claim foreign tax credit and avoid double taxation. Step-by-step guide to Form 1116 (USA), DTAA benefits, and tax treaty optimization for NRIs.',
    targetSearchVolume: '1,000-2,000/month',
    contentPillar: 'tax',
    targetPersona: ['USA NRIs', 'UK NRIs', 'Canada NRIs'],
    userIntent: 'commercial',
    funnelStage: 'decision',
    canRepurpose: {
      newsletterSection: true,
      socialMediaPosts: true,
      webinarTopic: true,
      emailSequence: true,
      infographic: true
    },
    estimatedTrafficPotential: 'medium',
    conversionPotential: 'high',
    linkBuildingValue: 'medium'
  },

  // PILLAR CONTENT (Strategic Long-form Guides)
  {
    id: 'pillar-001',
    title: 'The Complete NRI Tax Guide 2025',
    contentType: 'pillar-content',
    wordCount: '5,000-6,000',
    season: 'tax-season',
    publishMonth: 'January',
    priority: 'critical',
    primaryKeyword: 'NRI tax guide',
    secondaryKeywords: ['ITR filing NRI', 'tax residency', 'DTAA', 'NRI taxation', 'cross-border tax'],
    metaTitle: 'Complete NRI Tax Guide 2025: India, USA, UK, Canada Filing (5000+ words)',
    metaDescription: 'The ultimate NRI tax guide covering India ITR, US FBAR/FATCA, UK Self Assessment, Canada T1, DTAA benefits, residency rules, and tax-saving strategies. Bookmark this!',
    targetSearchVolume: '10,000-20,000/month',
    contentPillar: 'tax',
    targetPersona: ['All NRIs'],
    userIntent: 'informational',
    funnelStage: 'awareness',
    canRepurpose: {
      newsletterSection: true,
      socialMediaPosts: true,
      webinarTopic: true,
      emailSequence: true,
      infographic: true
    },
    estimatedTrafficPotential: 'high',
    conversionPotential: 'medium',
    linkBuildingValue: 'high'
  },
  {
    id: 'pillar-002',
    title: 'NRI Investment Playbook: Complete Guide to Building Wealth',
    contentType: 'pillar-content',
    wordCount: '5,000-6,000',
    season: 'investment-focus',
    publishMonth: 'May',
    priority: 'critical',
    primaryKeyword: 'NRI investment guide',
    secondaryKeywords: ['NRI mutual funds', 'NRI stocks', 'NRI real estate', 'NRE vs NRO', 'repatriation'],
    metaTitle: 'NRI Investment Guide 2025: Complete Playbook (Stocks, MF, Real Estate)',
    metaDescription: 'Comprehensive NRI investment guide covering mutual funds, stocks, real estate, FCNR deposits, taxation, repatriation, and portfolio strategies. 5000+ words.',
    targetSearchVolume: '8,000-15,000/month',
    contentPillar: 'investment',
    targetPersona: ['All NRIs'],
    userIntent: 'commercial',
    funnelStage: 'consideration',
    canRepurpose: {
      newsletterSection: true,
      socialMediaPosts: true,
      webinarTopic: true,
      emailSequence: true,
      infographic: true
    },
    estimatedTrafficPotential: 'high',
    conversionPotential: 'high',
    linkBuildingValue: 'high'
  },

  // INVESTMENT FOCUS (May - August)
  {
    id: 'inv-may-001',
    title: 'Best NRE Fixed Deposit Rates 2025',
    contentType: 'blog-post',
    wordCount: '1,500-2,000',
    season: 'investment-focus',
    publishMonth: 'May',
    priority: 'high',
    primaryKeyword: 'NRE FD rates',
    secondaryKeywords: ['NRE fixed deposit', 'best NRE rates', 'NRE vs FCNR'],
    metaTitle: 'Best NRE Fixed Deposit Rates 2025: Compare Top Banks (Tax-Free!)',
    metaDescription: 'Compare NRE FD rates from 15+ banks. Current rates: 6.5-7.5%. Tax-free interest, fully repatriable. Updated daily. Find the best NRE deposit for you.',
    targetSearchVolume: '5,000-10,000/month',
    contentPillar: 'investment',
    targetPersona: ['All NRIs'],
    userIntent: 'commercial',
    funnelStage: 'decision',
    canRepurpose: {
      newsletterSection: true,
      socialMediaPosts: true,
      webinarTopic: false,
      emailSequence: true,
      infographic: true
    },
    estimatedTrafficPotential: 'high',
    conversionPotential: 'medium',
    linkBuildingValue: 'medium'
  },
  {
    id: 'inv-jun-001',
    title: 'Should NRIs Invest in Indian Real Estate in 2025?',
    contentType: 'blog-post',
    wordCount: '2,000-2,500',
    season: 'investment-focus',
    publishMonth: 'June',
    priority: 'high',
    primaryKeyword: 'NRI real estate investment India',
    secondaryKeywords: ['NRI property purchase', 'NRI home loan', 'real estate returns India'],
    metaTitle: 'Should NRIs Invest in Indian Real Estate in 2025? (Pros, Cons, Returns)',
    metaDescription: 'Is Indian real estate a good investment for NRIs in 2025? Analyze returns, taxation, repatriation, market trends, and alternatives. Data-driven analysis.',
    targetSearchVolume: '3,000-5,000/month',
    contentPillar: 'investment',
    targetPersona: ['All NRIs'],
    userIntent: 'commercial',
    funnelStage: 'consideration',
    canRepurpose: {
      newsletterSection: true,
      socialMediaPosts: true,
      webinarTopic: true,
      emailSequence: true,
      infographic: false
    },
    estimatedTrafficPotential: 'high',
    conversionPotential: 'high',
    linkBuildingValue: 'high'
  },

  // IMMIGRATION FOCUS (September - December)
  {
    id: 'imm-sep-001',
    title: 'H1B to Green Card: Financial Planning Checklist',
    contentType: 'blog-post',
    wordCount: '1,800-2,200',
    season: 'immigration-focus',
    publishMonth: 'September',
    priority: 'high',
    primaryKeyword: 'H1B to green card financial planning',
    secondaryKeywords: ['green card tax implications', 'H1B investments', 'visa change financial planning'],
    metaTitle: 'H1B to Green Card Financial Checklist: Tax, Investments, Estate (2025)',
    metaDescription: 'Transitioning from H1B to Green Card? Complete financial checklist covering tax implications, investment changes, estate planning, and India ties. Don\'t miss critical steps!',
    targetSearchVolume: '2,000-4,000/month',
    contentPillar: 'immigration',
    targetPersona: ['USA NRIs'],
    userIntent: 'commercial',
    funnelStage: 'consideration',
    canRepurpose: {
      newsletterSection: true,
      socialMediaPosts: true,
      webinarTopic: true,
      emailSequence: true,
      infographic: true
    },
    estimatedTrafficPotential: 'medium',
    conversionPotential: 'high',
    linkBuildingValue: 'medium'
  },

  // PDF GUIDES (Resource Library)
  {
    id: 'pdf-001',
    title: 'NRI Tax Filing Guide 2025 [PDF Download]',
    contentType: 'pdf-guide',
    wordCount: '8,000-10,000 (25-30 pages)',
    season: 'tax-season',
    publishMonth: 'January',
    priority: 'critical',
    primaryKeyword: 'NRI tax guide PDF',
    secondaryKeywords: ['NRI tax filing checklist', 'FBAR guide PDF', 'ITR guide download'],
    metaTitle: 'Free Download: NRI Tax Filing Guide 2025 PDF (30 pages)',
    metaDescription: 'Download our comprehensive 30-page NRI Tax Filing Guide PDF covering India, USA, UK, Canada. Includes checklists, deadlines, forms, and strategies. 100% free.',
    targetSearchVolume: '1,000-3,000/month',
    contentPillar: 'tax',
    targetPersona: ['All NRIs'],
    userIntent: 'commercial',
    funnelStage: 'consideration',
    canRepurpose: {
      newsletterSection: true,
      socialMediaPosts: true,
      webinarTopic: true,
      emailSequence: true,
      infographic: false
    },
    estimatedTrafficPotential: 'medium',
    conversionPotential: 'high',
    linkBuildingValue: 'high'
  },
  {
    id: 'pdf-002',
    title: 'Complete NRI Investment Playbook [PDF]',
    contentType: 'pdf-guide',
    wordCount: '10,000-12,000 (30-35 pages)',
    season: 'investment-focus',
    publishMonth: 'May',
    priority: 'critical',
    primaryKeyword: 'NRI investment guide PDF',
    secondaryKeywords: ['NRI portfolio guide', 'investment checklist NRI'],
    metaTitle: 'Free Download: NRI Investment Playbook PDF (35 pages)',
    metaDescription: 'Free 35-page NRI Investment Playbook PDF. Mutual funds, stocks, real estate, taxation, repatriation, portfolio construction. Download now!',
    targetSearchVolume: '1,500-3,000/month',
    contentPillar: 'investment',
    targetPersona: ['All NRIs'],
    userIntent: 'commercial',
    funnelStage: 'consideration',
    canRepurpose: {
      newsletterSection: true,
      socialMediaPosts: true,
      webinarTopic: true,
      emailSequence: true,
      infographic: false
    },
    estimatedTrafficPotential: 'medium',
    conversionPotential: 'high',
    linkBuildingValue: 'high'
  },

  // CHECKLISTS (Quick Wins)
  {
    id: 'check-001',
    title: 'NRI Financial Planning Checklist [Free Download]',
    contentType: 'checklist',
    wordCount: '3,000-4,000 (8-10 pages)',
    season: 'year-round',
    publishMonth: 'Year-round',
    priority: 'high',
    primaryKeyword: 'NRI checklist',
    secondaryKeywords: ['NRI planning checklist', 'NRI financial checklist'],
    metaTitle: 'Free NRI Financial Planning Checklist PDF (Accounts, Tax, Investments)',
    metaDescription: 'Download free NRI financial planning checklist. Account setup, tax filing, investments, compliance - everything you need in one simple checklist PDF.',
    targetSearchVolume: '500-1,000/month',
    contentPillar: 'tax',
    targetPersona: ['All NRIs'],
    userIntent: 'transactional',
    funnelStage: 'decision',
    canRepurpose: {
      newsletterSection: true,
      socialMediaPosts: true,
      webinarTopic: false,
      emailSequence: true,
      infographic: true
    },
    estimatedTrafficPotential: 'medium',
    conversionPotential: 'high',
    linkBuildingValue: 'medium'
  }
];

/**
 * Get content by season
 */
export function getContentBySeason(season: StrategicContent['season']): StrategicContent[] {
  return strategicContentPlan.filter(content => content.season === season || content.season === 'year-round');
}

/**
 * Get content by month
 */
export function getContentByMonth(month: string): StrategicContent[] {
  return strategicContentPlan.filter(content =>
    content.publishMonth.toLowerCase().includes(month.toLowerCase()) ||
    content.publishMonth === 'Year-round'
  );
}

/**
 * Get content by type
 */
export function getContentByType(type: StrategicContent['contentType']): StrategicContent[] {
  return strategicContentPlan.filter(content => content.contentType === type);
}

/**
 * Get high-priority content
 */
export function getCriticalContent(): StrategicContent[] {
  return strategicContentPlan.filter(content => content.priority === 'critical');
}

/**
 * Get content by funnel stage
 */
export function getContentByFunnelStage(stage: StrategicContent['funnelStage']): StrategicContent[] {
  return strategicContentPlan.filter(content => content.funnelStage === stage);
}

/**
 * Get repurposeable content
 */
export function getRepurposeableContent(): StrategicContent[] {
  return strategicContentPlan.filter(content =>
    content.canRepurpose.newsletterSection ||
    content.canRepurpose.socialMediaPosts ||
    content.canRepurpose.webinarTopic
  );
}

/**
 * Content calendar summary
 */
export function getContentCalendarSummary() {
  return {
    totalContent: strategicContentPlan.length,
    byType: {
      blogPosts: getContentByType('blog-post').length,
      pillarContent: getContentByType('pillar-content').length,
      pdfGuides: getContentByType('pdf-guide').length,
      checklists: getContentByType('checklist').length,
    },
    bySeason: {
      taxSeason: getContentBySeason('tax-season').length,
      investmentFocus: getContentBySeason('investment-focus').length,
      immigrationFocus: getContentBySeason('immigration-focus').length,
      yearRound: getContentBySeason('year-round').length,
    },
    critical: getCriticalContent().length,
    highTrafficPotential: strategicContentPlan.filter(c => c.estimatedTrafficPotential === 'high').length,
    highConversionPotential: strategicContentPlan.filter(c => c.conversionPotential === 'high').length,
  };
}
