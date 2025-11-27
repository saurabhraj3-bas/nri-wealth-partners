/**
 * AI-Powered Content Topic Suggestions
 * Categorized topics for NRI resource generation
 */

export interface ContentTopic {
  id: string;
  title: string;
  category: 'tax' | 'investment' | 'immigration' | 'guides' | 'checklists';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedLength: string;
  targetAudience: string[];
  keywords: string[];
  outline: string[];
  priority: 'high' | 'medium' | 'low';
}

export const suggestedTopics: ContentTopic[] = [
  // TAX RESOURCES
  {
    id: 'tax-001',
    title: 'NRI Tax Filing Guide 2025',
    category: 'tax',
    difficulty: 'intermediate',
    estimatedLength: '25-30 pages',
    targetAudience: ['USA NRIs', 'UK NRIs', 'Canada NRIs', 'All NRIs'],
    keywords: ['tax filing', 'ITR', 'FBAR', 'FATCA', 'DTAA', 'residency status'],
    outline: [
      'Introduction & Who Should Read',
      'Determining Tax Residency Status',
      'India Tax Filing Requirements',
      'US Tax Filing (FBAR, FATCA, Form 1040)',
      'UK Tax Filing (Self Assessment)',
      'Canada Tax Filing (T1 Return)',
      'UAE & Tax-Free Jurisdictions',
      'Double Taxation Avoidance Agreements',
      'Common Mistakes to Avoid',
      'Important Deadlines',
      'Tax-Saving Strategies',
      'Document Checklist',
      'FAQs'
    ],
    priority: 'high'
  },
  {
    id: 'tax-002',
    title: 'FBAR Compliance Guide for NRIs',
    category: 'tax',
    difficulty: 'intermediate',
    estimatedLength: '10-12 pages',
    targetAudience: ['USA NRIs'],
    keywords: ['FBAR', 'FinCEN 114', 'foreign accounts', 'compliance', 'penalties'],
    outline: [
      'What is FBAR?',
      'Who Must File FBAR',
      '$10,000 Threshold Calculation',
      'Accounts to Report',
      'Filing Process Step-by-Step',
      'Common Mistakes',
      'Penalties for Non-Compliance',
      'Voluntary Disclosure Options',
      'FAQs'
    ],
    priority: 'high'
  },
  {
    id: 'tax-003',
    title: 'Old vs New Tax Regime: Decision Framework for NRIs',
    category: 'tax',
    difficulty: 'beginner',
    estimatedLength: '8-10 pages',
    targetAudience: ['All NRIs'],
    keywords: ['tax regime', 'Section 80C', 'deductions', 'tax rates'],
    outline: [
      'Overview of Both Regimes',
      'Tax Rate Comparison',
      'Deductions Available',
      'Decision Tree',
      'Scenarios & Examples',
      'Calculation Worksheets',
      'FAQs'
    ],
    priority: 'medium'
  },
  {
    id: 'tax-004',
    title: 'State Tax Guide for H1B & L1 Visa Holders',
    category: 'tax',
    difficulty: 'intermediate',
    estimatedLength: '15-18 pages',
    targetAudience: ['USA NRIs'],
    keywords: ['state taxes', 'H1B', 'L1', 'California', 'New York', 'Texas'],
    outline: [
      'Federal vs State Taxes',
      'State Tax Rates by State',
      'States with No Income Tax',
      'Multi-State Tax Issues',
      'Remote Work Implications',
      'Filing Requirements',
      'Common Credits & Deductions',
      'FAQs by State'
    ],
    priority: 'medium'
  },

  // INVESTMENT RESOURCES
  {
    id: 'inv-001',
    title: 'Complete NRI Investment Playbook',
    category: 'investment',
    difficulty: 'intermediate',
    estimatedLength: '30-35 pages',
    targetAudience: ['All NRIs'],
    keywords: ['investment', 'mutual funds', 'stocks', 'real estate', 'portfolio'],
    outline: [
      'Investment Landscape for NRIs',
      'NRE vs NRO vs FCNR Accounts',
      'Investment Options in India',
      'Equity Investments (Direct Stocks)',
      'Mutual Funds for NRIs',
      'Real Estate Investment',
      'Fixed Income Options',
      'Gold & Commodities',
      'Regulatory Compliance (RBI, FEMA)',
      'Taxation on Investments',
      'Repatriation Rules',
      'Portfolio Construction',
      'Risk Management',
      'FAQs'
    ],
    priority: 'high'
  },
  {
    id: 'inv-002',
    title: 'Real Estate Investment Guide for NRIs',
    category: 'investment',
    difficulty: 'intermediate',
    estimatedLength: '20-25 pages',
    targetAudience: ['All NRIs'],
    keywords: ['real estate', 'property', 'purchase', 'sale', 'rental income', 'FEMA'],
    outline: [
      'Can NRIs Buy Property in India?',
      'FEMA Regulations',
      'Types of Properties Allowed',
      'Financing Options (Home Loans)',
      'Purchase Process Step-by-Step',
      'Documentation Required',
      'Taxation (Purchase, Rental, Sale)',
      'Capital Gains & Exemptions',
      'Repatriation of Sale Proceeds',
      'Power of Attorney Considerations',
      'Common Pitfalls',
      'Exit Strategy',
      'FAQs'
    ],
    priority: 'high'
  },
  {
    id: 'inv-003',
    title: 'Mutual Fund Selection Framework for NRIs',
    category: 'investment',
    difficulty: 'beginner',
    estimatedLength: '12-15 pages',
    targetAudience: ['All NRIs'],
    keywords: ['mutual funds', 'SIP', 'equity', 'debt', 'portfolio'],
    outline: [
      'Types of Mutual Funds',
      'How to Select Funds',
      'Performance Metrics',
      'Expense Ratios & Costs',
      'SIP vs Lumpsum',
      'Asset Allocation',
      'Top Fund Houses',
      'Tax Implications',
      'Redemption & Repatriation',
      'Recommended Portfolios'
    ],
    priority: 'medium'
  },
  {
    id: 'inv-004',
    title: 'Currency Impact on NRI Investments',
    category: 'investment',
    difficulty: 'advanced',
    estimatedLength: '15-18 pages',
    targetAudience: ['USA NRIs', 'UK NRIs', 'Canada NRIs'],
    keywords: ['currency', 'forex', 'hedging', 'USD-INR', 'GBP-INR', 'CAD-INR'],
    outline: [
      'Understanding Currency Risk',
      'Historical Currency Trends',
      'Impact on Investment Returns',
      'Natural Hedging Strategies',
      'Currency Futures & Options',
      'Timing Considerations',
      'Portfolio Allocation Across Currencies',
      'Case Studies',
      'FAQs'
    ],
    priority: 'low'
  },

  // IMMIGRATION RESOURCES
  {
    id: 'imm-001',
    title: 'Immigration Planning Checklist: Financial Considerations',
    category: 'immigration',
    difficulty: 'intermediate',
    estimatedLength: '15-20 pages',
    targetAudience: ['USA NRIs', 'Canada NRIs', 'UK NRIs'],
    keywords: ['immigration', 'visa', 'green card', 'H1B', 'financial planning'],
    outline: [
      'Financial Planning by Visa Type',
      'H1B to Green Card Journey',
      'L1 Visa Considerations',
      'O1 Visa for Exceptional Talent',
      'EB5 Investor Visa',
      'OCI Application Financial Requirements',
      'Maintaining Indian Investments',
      'Tax Implications of Status Change',
      'Estate Planning During Transitions',
      'Checklist by Visa Category'
    ],
    priority: 'high'
  },
  {
    id: 'imm-002',
    title: 'OCI Application Guide: Financial & Documentation',
    category: 'immigration',
    difficulty: 'beginner',
    estimatedLength: '10-12 pages',
    targetAudience: ['All NRIs'],
    keywords: ['OCI', 'PIO', 'citizenship', 'documentation', 'benefits'],
    outline: [
      'What is OCI?',
      'Eligibility Criteria',
      'Benefits of OCI',
      'Application Process',
      'Documents Required',
      'Financial Proof Requirements',
      'Processing Time & Fees',
      'Common Rejections',
      'OCI vs PIO vs Tourist Visa',
      'FAQs'
    ],
    priority: 'medium'
  },
  {
    id: 'imm-003',
    title: 'Green Card Holder\'s Financial Planning Guide',
    category: 'immigration',
    difficulty: 'intermediate',
    estimatedLength: '18-22 pages',
    targetAudience: ['USA NRIs'],
    keywords: ['green card', 'permanent resident', 'taxation', 'investments', 'estate'],
    outline: [
      'Green Card Tax Obligations',
      'Worldwide Income Reporting',
      'Foreign Asset Disclosure',
      'Maintaining Green Card (Residency)',
      'India Investments After Green Card',
      'Repatriation Options',
      'Estate Tax Implications',
      'Citizenship Timeline',
      'Giving Up Green Card (Tax Consequences)',
      'FAQs'
    ],
    priority: 'medium'
  },

  // COMPREHENSIVE GUIDES
  {
    id: 'guide-001',
    title: 'Retirement Planning Guide for NRIs',
    category: 'guides',
    difficulty: 'intermediate',
    estimatedLength: '25-30 pages',
    targetAudience: ['All NRIs'],
    keywords: ['retirement', 'corpus', 'pension', 'Social Security', '401k', 'EPF'],
    outline: [
      'Retirement Planning Basics',
      'Corpus Calculation',
      'Asset Allocation in Retirement',
      'India vs Residence Country Retirement',
      'Social Security (USA)',
      '401(k) / IRA (USA)',
      'UK Pension Schemes',
      'Canada CPP & RRSP',
      'EPF & NPS in India',
      'Health Insurance in Retirement',
      'Repatriation for Retirement',
      'Estate Planning',
      'Withdrawal Strategies',
      'Tax Optimization'
    ],
    priority: 'high'
  },
  {
    id: 'guide-002',
    title: 'Repatriation Guide: Bringing Money Back to India',
    category: 'guides',
    difficulty: 'intermediate',
    estimatedLength: '15-18 pages',
    targetAudience: ['All NRIs'],
    keywords: ['repatriation', 'RBI', 'FEMA', 'NRO', 'NRE', 'Form 15CA/15CB'],
    outline: [
      'RBI Repatriation Rules',
      'NRE Account Repatriation (Fully Free)',
      'NRO Account Repatriation (USD 1M Limit)',
      'Sale of Property Proceeds',
      'Form 15CA & 15CB Process',
      'Tax Clearance Certificate',
      'Documentation Required',
      'Bank Process & Timelines',
      'Common Issues & Solutions',
      'FAQs'
    ],
    priority: 'high'
  },
  {
    id: 'guide-003',
    title: 'Estate Planning for NRIs: Wills, Trusts, and Succession',
    category: 'guides',
    difficulty: 'advanced',
    estimatedLength: '25-30 pages',
    targetAudience: ['All NRIs'],
    keywords: ['estate planning', 'will', 'trust', 'succession', 'inheritance tax'],
    outline: [
      'Why Estate Planning Matters',
      'Assets in Multiple Countries',
      'Indian Succession Laws',
      'US/UK/Canada Estate Laws',
      'Writing a Valid Will',
      'Trusts for NRIs',
      'Nomination vs Will',
      'Joint Ownership',
      'Power of Attorney',
      'Inheritance Tax (US, UK)',
      'Avoiding Probate',
      'Digital Assets',
      'Executors & Trustees',
      'FAQs'
    ],
    priority: 'medium'
  },
  {
    id: 'guide-004',
    title: 'NRE vs NRO vs FCNR: Complete Account Guide',
    category: 'guides',
    difficulty: 'beginner',
    estimatedLength: '12-15 pages',
    targetAudience: ['All NRIs'],
    keywords: ['NRE', 'NRO', 'FCNR', 'accounts', 'taxation', 'repatriation'],
    outline: [
      'Types of NRI Accounts',
      'NRE Account Features',
      'NRO Account Features',
      'FCNR Account Features',
      'Comparison Table',
      'Which Account for What Purpose',
      'Taxation Differences',
      'Repatriation Rules',
      'Interest Rates',
      'How to Open Each Account',
      'Joint Accounts',
      'Converting Resident to NRI Account',
      'FAQs'
    ],
    priority: 'high'
  },

  // CHECKLISTS
  {
    id: 'check-001',
    title: 'NRI Financial Planning Checklist',
    category: 'checklists',
    difficulty: 'beginner',
    estimatedLength: '8-10 pages',
    targetAudience: ['All NRIs'],
    keywords: ['checklist', 'planning', 'accounts', 'investments', 'tax'],
    outline: [
      'Account Setup Checklist',
      'Investment Planning Checklist',
      'Tax Filing Checklist',
      'Annual Review Checklist',
      'Life Event Checklists (Marriage, Children, etc.)',
      'Return to India Checklist'
    ],
    priority: 'medium'
  },
  {
    id: 'check-002',
    title: 'H1B Visa Financial Checklist',
    category: 'checklists',
    difficulty: 'beginner',
    estimatedLength: '6-8 pages',
    targetAudience: ['USA NRIs'],
    keywords: ['H1B', 'visa', 'checklist', 'financial planning'],
    outline: [
      'Before Arriving in USA',
      'First Week Checklist',
      'First Month Setup',
      'Tax Planning Checklist',
      'Investment Setup',
      'Insurance Requirements',
      'Maintain India Ties'
    ],
    priority: 'low'
  },
  {
    id: 'check-003',
    title: 'Property Purchase Checklist for NRIs',
    category: 'checklists',
    difficulty: 'beginner',
    estimatedLength: '8-10 pages',
    targetAudience: ['All NRIs'],
    keywords: ['property', 'real estate', 'checklist', 'purchase'],
    outline: [
      'Pre-Purchase Research',
      'Financial Arrangement',
      'Legal Due Diligence',
      'Documentation Required',
      'Home Loan Process',
      'Registration & Possession',
      'Post-Purchase Compliance'
    ],
    priority: 'medium'
  },
  {
    id: 'check-004',
    title: 'Returning to India: Financial Transition Checklist',
    category: 'checklists',
    difficulty: 'intermediate',
    estimatedLength: '12-15 pages',
    targetAudience: ['All NRIs'],
    keywords: ['return to India', 'reverse migration', 'checklist', 'RNOR'],
    outline: [
      '6 Months Before Return',
      '3 Months Before Return',
      'Final Month Checklist',
      'Tax Residency Change',
      'RNOR Status Planning',
      'Account Conversions',
      'Investment Rebalancing',
      'Insurance Transitions',
      'First 90 Days After Return',
      'FAQs'
    ],
    priority: 'medium'
  }
];

/**
 * Get topics by category
 */
export function getTopicsByCategory(category: ContentTopic['category']): ContentTopic[] {
  return suggestedTopics.filter(topic => topic.category === category);
}

/**
 * Get topics by priority
 */
export function getTopicsByPriority(priority: ContentTopic['priority']): ContentTopic[] {
  return suggestedTopics.filter(topic => topic.priority === priority);
}

/**
 * Get topics by difficulty
 */
export function getTopicsByDifficulty(difficulty: ContentTopic['difficulty']): ContentTopic[] {
  return suggestedTopics.filter(topic => topic.difficulty === difficulty);
}

/**
 * Search topics by keywords
 */
export function searchTopics(query: string): ContentTopic[] {
  const queryLower = query.toLowerCase();
  return suggestedTopics.filter(topic =>
    topic.title.toLowerCase().includes(queryLower) ||
    topic.keywords.some(keyword => keyword.toLowerCase().includes(queryLower)) ||
    topic.targetAudience.some(audience => audience.toLowerCase().includes(queryLower))
  );
}

/**
 * Get topic by ID
 */
export function getTopicById(id: string): ContentTopic | undefined {
  return suggestedTopics.find(topic => topic.id === id);
}

/**
 * Get recommended topics (high priority)
 */
export function getRecommendedTopics(): ContentTopic[] {
  return suggestedTopics.filter(topic => topic.priority === 'high');
}
