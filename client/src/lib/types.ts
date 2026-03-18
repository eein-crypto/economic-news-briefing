// News data types
export interface InvestmentOpinion {
  sentiment: 'positive' | 'negative' | 'neutral';
  opinion: string;
  riskLevel: 'low' | 'medium' | 'high';
  confidence?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  detailedExplanation: string; // 더 자세한 설명
  investmentOpinion?: InvestmentOpinion; // 투자 의견
  category: 'domestic' | 'international' | 'investment' | 'market' | 'economic';
  readingTime: number; // in minutes
  link: string;
  publishedAt: string; // ISO date string
  source: string;
  sourceUrl?: string; // 실제 기사 링크
}

export interface BriefingData {
  date: string; // ISO date string
  lastUpdated: string; // ISO date string
  news: NewsItem[];
  investmentReport: string;
  predictions?: any[];
}

export interface CategoryBadge {
  category: 'domestic' | 'international' | 'investment' | 'market' | 'economic';
  label: string;
  icon: string;
  color: 'blue' | 'teal' | 'green' | 'amber';
}

// Category configuration
export const CATEGORY_CONFIG: Record<string, CategoryBadge> = {
  domestic: {
    category: 'domestic',
    label: '국내',
    icon: '🇰🇷',
    color: 'blue'
  },
  international: {
    category: 'international',
    label: '국제',
    icon: '🌍',
    color: 'teal'
  },
  investment: {
    category: 'investment',
    label: '투자',
    icon: '📈',
    color: 'green'
  },
  market: {
    category: 'market',
    label: '시장',
    icon: '📊',
    color: 'amber'
  },
  economic: {
    category: 'economic',
    label: '경제',
    icon: '💹',
    color: 'green'
  }
};
