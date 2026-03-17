// News data types
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  detailedExplanation: string; // 더 자세한 설명
  category: 'domestic' | 'international' | 'investment' | 'market';
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
}

export interface CategoryBadge {
  category: 'domestic' | 'international' | 'investment' | 'market';
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
  }
};
