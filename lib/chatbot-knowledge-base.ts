/**
 * AI Chatbot Knowledge Base
 *
 * Structured Q&A pairs for the AI chatbot to provide consistent,
 * compliant responses to common NRI wealth management questions.
 */

export interface KnowledgeBaseEntry {
  id: string;
  question: string;
  suggestedResponse: string;
  category: string;
}

export const chatbotKnowledgeBase: KnowledgeBaseEntry[] = [
  {
    id: 'Q1',
    question: 'What types of assets do you advise on for NRIs - Indian equities, mutual funds, real estate, US/UK/Australia investments?',
    suggestedResponse: 'We advise on a range of assets including Indian equities, mutual funds, fixed income and, where suitable, overseas investments. All advice is tailored to your goals and risk profile while following applicable regulations.',
    category: 'Services'
  },
  {
    id: 'Q2',
    question: 'Do you provide holistic cross-border financial planning, including tax, estate, retirement, repatriation of funds?',
    suggestedResponse: 'Yes, we provide holistic cross-border planning covering investments, retirement, tax, estate and repatriation. For complex tax/legal matters, we work with qualified professionals in your country of residence.',
    category: 'Services'
  },
  {
    id: 'Q3',
    question: 'Which countries are your NRI clients primarily based in (US, UK, Australia, Middle East, Canada)? How many clients from my region?',
    suggestedResponse: 'We work with NRIs mainly in the US, UK, Middle East, Canada, Australia and Singapore. For privacy reasons we do not share client details.',
    category: 'About Us'
  },
  {
    id: 'Q4',
    question: 'What is your experience with NRIs wanting to repatriate funds from India to Australia? Are there any restrictions I should know?',
    suggestedResponse: 'We have experience helping NRIs repatriate funds from India to Australia under FEMA/RBI rules. NRE funds are usually freely repatriable, while NRO funds may have annual limits and require documentation.',
    category: 'Repatriation'
  },
  {
    id: 'Q5',
    question: 'Are you registered with Securities and Exchange Board of India (SEBI)? What is your registration number / firm name?',
    suggestedResponse: 'I am an AI assistant and not a regulated entity; however, regulated advice is provided only through appropriately licensed/registered professionals. We share regulatory details, including registration numbers, before you engage formally.',
    category: 'Compliance'
  },
  {
    id: 'Q6',
    question: 'How do you stay compliant with overseas tax regimes (for example US FATCA, CRS, Australia residency rules, etc)?',
    suggestedResponse: 'We collect proper KYC and tax-residency details to comply with FATCA/CRS and other reporting rules. We also monitor regulatory changes and coordinate with licensed tax professionals when required.',
    category: 'Compliance'
  },
  {
    id: 'Q7',
    question: 'Can you provide sample client testimonials/case-studies (anonymised) of NRIs similar to my profile?',
    suggestedResponse: 'To protect confidentiality, we do not share real client testimonials. Instead, we provide anonymised or hypothetical examples of situations similar to yours.',
    category: 'About Us'
  },
  {
    id: 'Q8',
    question: 'How do you charge for your services? (Flat fee, percentage of assets under advisory, performance fee, commissions?)',
    suggestedResponse: 'We use a transparent, fee-based model, usually a percentage of Assets Under Advisory (AUM). All fees are clearly shared in writing before you start.',
    category: 'Fees'
  },
  {
    id: 'Q9',
    question: 'Are there any additional costs (account-opening, exit fees, repatriation charges, currency conversion)?',
    suggestedResponse: 'Additional costs may include brokerage, account-opening charges, bank remittance fees, FX conversion, or CA certificate fees for repatriation. We explain these expected costs upfront.',
    category: 'Fees'
  },
  {
    id: 'Q10',
    question: 'What is your minimum asset size for NRIs? Do you accept clients outside India (living in Australia/UK/US)?',
    suggestedResponse: 'We typically work best with clients having around USD 50,000 in investable assets, though exceptions may apply. We accept NRIs living overseas and always assess suitability and local regulations first.',
    category: 'Onboarding'
  },
  {
    id: 'Q11',
    question: 'Do you provide an online dashboard / mobile app where I can see my portfolio, performance, fees, documents?',
    suggestedResponse: 'Yes, we provide a secure online dashboard where you can view portfolio performance, holdings, fees and key documents. Your data is protected using strong security measures.',
    category: 'Technology'
  },
  {
    id: 'Q12',
    question: 'How frequently do you rebalance portfolios / review tax planning for NRIs?',
    suggestedResponse: 'We usually review and rebalance portfolios quarterly, and sooner if your situation or markets change. Tax/residency reviews are done annually or when there\'s a major life change.',
    category: 'Portfolio Management'
  },
  {
    id: 'Q13',
    question: 'What is the process for onboarding an NRI — remote digital KYC, power of attorney, overseas documentation, ongoing communication (time zones)?',
    suggestedResponse: 'Onboarding starts with an online discussion followed by digital KYC using your passport and overseas address. We accept attested/notarised documents and can use a Power of Attorney if required.',
    category: 'Onboarding'
  },
  {
    id: 'Q14',
    question: 'How do you handle cross-border tax planning between India and my country of residence? E.g., double-taxation treaties, capital gain tax, reporting compliance.',
    suggestedResponse: 'We apply Indian tax rules, your country\'s tax laws and any applicable DTAA to reduce double taxation. For accuracy, we also recommend consulting a qualified tax advisor in your country of residence.',
    category: 'Tax Planning'
  },
  {
    id: 'Q15',
    question: 'If I invest via an NRE/NRO account, how do you advise on the repatriation rules and conversion risk from INR to my home currency?',
    suggestedResponse: 'NRE funds are generally freely repatriable, while NRO funds have annual limits and require tax-clearance documents like Form 15CA/15CB. We also explain currency-conversion risks and help with required paperwork.',
    category: 'Repatriation'
  },
  {
    id: 'Q16',
    question: 'What happens if I change my country of residence (e.g., move from UAE to UK) — do you help update the plan accordingly?',
    suggestedResponse: 'Yes, we update your entire plan when you change countries, including tax, residency, and reporting rules. Please inform us promptly so we can keep your plan compliant.',
    category: 'Services'
  },
  {
    id: 'Q17',
    question: 'How do you measure success / performance for your clients? Can you share benchmarks or historical performance (net of fees)?',
    suggestedResponse: 'We measure success by how well you progress toward your personal goals within your risk level. Benchmarks or past performance are shared with proper disclosures and reminders that past results don\'t guarantee future returns.',
    category: 'Portfolio Management'
  },
  {
    id: 'Q18',
    question: 'How transparent is the reporting? Will I receive quarterly statements, tax summary, cost breakdown?',
    suggestedResponse: 'You receive clear quarterly statements showing holdings, performance and fees, plus supporting documents like transaction summaries. We aim for full transparency in reporting.',
    category: 'Reporting'
  },
  {
    id: 'Q19',
    question: 'What is your methodology for portfolio construction for NRIs - do you focus only on India or global diversification?',
    suggestedResponse: 'We build portfolios based on your goals, risk level and residency, and generally recommend diversification across India and global markets. We also consider tax, currency and repatriation factors.',
    category: 'Portfolio Management'
  },
  {
    id: 'Q20',
    question: 'How do you handle estate planning or wealth transfer for NRIs (especially with assets in India and abroad)?',
    suggestedResponse: 'We help organise your assets and coordinate with legal/tax professionals in India and abroad for proper estate planning. Qualified lawyers handle the legal aspects while we manage the financial structure.',
    category: 'Estate Planning'
  },
  {
    id: 'Q21',
    question: 'Are you able to coordinate with legal advisors outside India to ensure seamless transfer and tax efficient structuring?',
    suggestedResponse: 'Yes, we coordinate with legal and tax advisors in your home country and in India to support efficient structuring. Our role is financial coordination - licensed professionals provide the legal/tax advice.',
    category: 'Estate Planning'
  },
  {
    id: 'Q22',
    question: 'If I decide to exit the advisory or switch to another provider, what is the process / cost?',
    suggestedResponse: 'If you choose to exit, you simply give notice and we help prepare statements, transfer accounts and settle outstanding fees. Any transfer-related or custodial charges are disclosed in advance.',
    category: 'Fees'
  },
  {
    id: 'Q23',
    question: 'If regulatory changes occur (India or my residence country), how do you adjust the plan / fees?',
    suggestedResponse: 'We actively monitor regulatory changes and adjust your plan when rules change in India or your country. Fee changes, if ever needed, are always shared with you in advance for approval.',
    category: 'Compliance'
  },
  {
    id: 'Q24',
    question: 'What happens if the markets are very volatile — what risk management strategies do you use for NRIs?',
    suggestedResponse: 'We manage volatility through diversification, disciplined asset allocation and regular rebalancing. For NRIs, we also account for currency and repatriation risks to keep the strategy aligned with your comfort level.',
    category: 'Risk Management'
  },
  {
    id: 'Q25',
    question: 'Do you have a newsletter? How can I subscribe to get insights and updates?',
    suggestedResponse: 'Yes! We publish a weekly AI-curated newsletter covering success stories, regulatory updates, financial insights, and community news. You can subscribe at /insights/subscribe. It\'s free, and we scan 200+ articles weekly to bring you only the most relevant insights for NRIs.',
    category: 'Newsletter'
  },
  {
    id: 'Q26',
    question: 'What is the difference between your Newsletter and News Feed?',
    suggestedResponse: 'Our Newsletter (/insights) is a weekly AI-curated digest with expert summaries and analysis delivered to your inbox. The News Feed (/news) provides real-time breaking news from official sources like USCIS, IRS, RBI, and Bloomberg. Newsletter is for deep reading, News Feed is for quick daily updates.',
    category: 'Newsletter'
  },
  {
    id: 'Q27',
    question: 'Where can I find resources, guides, or downloadable PDFs about NRI topics?',
    suggestedResponse: 'Visit our Resources page (/resources) where you can download comprehensive guides, tax checklists, investment playbooks, immigration guides, and market insights. All resources are categorized by topic (tax, investment, immigration, etc.) and available as PDFs.',
    category: 'Resources'
  },
  {
    id: 'Q28',
    question: 'Do you offer webinars or educational sessions for NRIs?',
    suggestedResponse: 'Yes, we host regular webinars on NRI tax filing, investment strategies, immigration planning, and more. Visit /webinars to see upcoming sessions and register. Past webinar recordings are also available for registered attendees.',
    category: 'Webinars'
  },
  {
    id: 'Q29',
    question: 'What topics does your newsletter cover?',
    suggestedResponse: 'Our newsletter covers four key areas: (1) Success Stories - real NRI wealth journeys, (2) Regulatory Updates - FEMA, tax law changes, compliance, (3) Financial Insights - market trends, investment opportunities, (4) Community News - NRI diaspora events and initiatives. Subscribe at /insights/subscribe.',
    category: 'Newsletter'
  },
  {
    id: 'Q30',
    question: 'How do I stay updated with the latest immigration, tax, and investment news for NRIs?',
    suggestedResponse: 'We offer two ways: (1) Subscribe to our weekly Newsletter (/insights/subscribe) for curated analysis and summaries, (2) Check our News Feed (/news) daily for real-time updates from USCIS, IRS, RBI, Bloomberg, and other trusted sources. You can filter news by category (immigration, tax, investment, market).',
    category: 'News'
  },
  {
    id: 'Q31',
    question: 'Can I download guides or checklists for specific topics like tax filing or investment?',
    suggestedResponse: 'Absolutely! Our Resources page (/resources) offers downloadable PDFs including: NRI Tax Filing Guide, Investment Playbook, Immigration Planning Checklist, Retirement Planning Guide, FBAR Reporting Guide, and more. All resources are free to download.',
    category: 'Resources'
  },
  {
    id: 'Q32',
    question: 'How often do you publish new content, articles, or resources?',
    suggestedResponse: 'We publish a weekly newsletter every Monday with 10-15 curated articles. Our News Feed updates daily with breaking news. New resources (guides, checklists, PDFs) are added monthly. We also host 2 webinars per month on rotating topics.',
    category: 'Content'
  }
];

/**
 * Helper function to find relevant knowledge base entries
 */
export function findRelevantKnowledge(userQuery: string, maxResults: number = 3): KnowledgeBaseEntry[] {
  const queryLower = userQuery.toLowerCase();

  // Score each entry based on keyword matches
  const scoredEntries = chatbotKnowledgeBase.map(entry => {
    const questionLower = entry.question.toLowerCase();
    const responseLower = entry.suggestedResponse.toLowerCase();

    let score = 0;

    // Check for exact phrase matches
    if (questionLower.includes(queryLower)) {
      score += 100;
    }

    // Check for keyword matches
    const keywords = queryLower.split(' ').filter(word => word.length > 3);
    keywords.forEach(keyword => {
      if (questionLower.includes(keyword)) score += 10;
      if (responseLower.includes(keyword)) score += 5;
    });

    // Boost certain categories based on query content
    if (queryLower.includes('fee') || queryLower.includes('cost') || queryLower.includes('charge')) {
      if (entry.category === 'Fees') score += 20;
    }
    if (queryLower.includes('tax') || queryLower.includes('dtaa') || queryLower.includes('fatca')) {
      if (entry.category === 'Tax Planning' || entry.category === 'Compliance') score += 20;
    }
    if (queryLower.includes('repatriate') || queryLower.includes('nre') || queryLower.includes('nro')) {
      if (entry.category === 'Repatriation') score += 20;
    }
    if (queryLower.includes('newsletter') || queryLower.includes('subscribe') || queryLower.includes('insights')) {
      if (entry.category === 'Newsletter') score += 20;
    }
    if (queryLower.includes('news') || queryLower.includes('updates') || queryLower.includes('breaking')) {
      if (entry.category === 'News' || entry.category === 'Content') score += 20;
    }
    if (queryLower.includes('resource') || queryLower.includes('guide') || queryLower.includes('pdf') || queryLower.includes('download')) {
      if (entry.category === 'Resources') score += 20;
    }
    if (queryLower.includes('webinar') || queryLower.includes('seminar') || queryLower.includes('session') || queryLower.includes('event')) {
      if (entry.category === 'Webinars') score += 20;
    }

    return { entry, score };
  });

  // Sort by score and return top results
  return scoredEntries
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(({ entry }) => entry);
}

/**
 * Get all categories
 */
export function getCategories(): string[] {
  return Array.from(new Set(chatbotKnowledgeBase.map(entry => entry.category)));
}

/**
 * Get entries by category
 */
export function getEntriesByCategory(category: string): KnowledgeBaseEntry[] {
  return chatbotKnowledgeBase.filter(entry => entry.category === category);
}
