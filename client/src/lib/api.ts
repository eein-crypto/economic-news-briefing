import { BriefingData, NewsItem } from './types';

// Mock data for development
// In production, this would be replaced with actual API calls or static data from GitHub
const MOCK_BRIEFING_DATA: BriefingData = {
  date: new Date().toISOString().split('T')[0],
  lastUpdated: new Date().toISOString(),
  news: [
    {
      id: '1',
      title: '원·달러 환율 1500원 넘어 출발…1501.0원 개장',
      summary: '원화 가치가 달러 대비 약해지고 있습니다. 환율이 1500원을 넘어섰다는 것은 달러 1개를 사려면 원화 1500개 이상을 줘야 한다는 뜻입니다. 이는 한국 경제의 대외 경쟁력과 수출입 가격에 직접적인 영향을 미칩니다.',
      detailedExplanation: '환율이란 무엇을까요?\n환율은 한 나라의 화폐를 다른 나라의 화폐로 바꿀 때의 교환 비율을 말합니다. 예를 들어, 환율이 1500원이라는 것은 미국 달러 1개를 사려면 한국 원화 1500개를 줘야 한다는 의미입니다.\n\n환율이 올라간다는 것의 의미\n환율이 올라간다는 것은 원화의 가치가 달러에 비해 떨어진다는 뜻입니다. 이전에는 1400원이면 달러 1개를 살 수 있었는데, 이제는 1500원을 줘야 한다면, 원화의 가치가 내려간 것이죠.\n\n환율 변동의 원인\n환율이 변하는 이유는 여러 가지입니다. 첫째, 미국의 경제가 좋아지면 달러를 원하는 사람이 많아져서 달러 가치가 올라갑니다. 둘째, 한국의 경제가 어려워지면 원화를 팔고 달러를 사려는 사람이 많아져서 원화 가치가 내려갑니다. 셋째, 금리 차이도 영향을 미칩니다. 미국의 금리가 높으면 달러에 투자하려는 사람이 많아져서 달러 가치가 올라갑니다.\n\n환율 상승이 우리 생활에 미치는 영향\n환율이 올라가면 여러 가지 변화가 생깁니다. 첫째, 외국에서 물건을 사올 때 더 비싸집니다. 예를 들어, 미국 제품이 100달러라면, 환율이 1400원일 때는 140,000원이지만, 환율이 1500원이 되면 150,000원이 됩니다. 둘째, 해외 여행을 갈 때도 더 많은 돈이 필요합니다. 셋째, 한국 회사들이 외국에서 물건을 사올 때 비용이 올라가므로, 제품 가격이 인상될 수 있습니다.\n\n환율 상승이 긍정적인 측면\n반대로 긍정적인 측면도 있습니다. 환율이 올라가면 한국 제품을 외국에 팔 때 더 싸지므로, 외국 구매자들이 한국 제품을 더 많이 사갑니다. 따라서 한국의 수출 회사들은 더 많은 물건을 팔 수 있게 됩니다. 이는 한국 경제에 긍정적인 영향을 미칠 수 있습니다.',
      category: 'market',
      readingTime: 5,
      link: 'https://www.hankyung.com/economy',
      sourceUrl: 'https://www.hankyung.com/economy',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: '한국경제'
    }
  ],
  investmentReport: '## 📊 오늘의 경제 분석 및 투자 리포트\n\n### 현재 경제 상황\n\n분산 투자를 권장합니다.'
};

export async function fetchBriefingData(): Promise<BriefingData> {
  try {
    // 로컬 경로에서 수집된 뉴스 데이터 로드
    const response = await fetch('/data/analysis.json');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 로컬에서 뉴스 데이터 로드 성공:', data);
      
      // 수집된 데이터를 BriefingData 형식으로 변환
      if (data.topNews && data.insights) {
        const convertedNews = data.topNews.map((news: any, idx: number) => ({
          id: news.id || `news_${idx}`,
          title: news.title,
          summary: news.summary || news.title,
          detailedExplanation: `이 뉴스는 "${news.category}" 카테고리에 속하며, 중요도 점수는 ${news.importance}점입니다.\n\n원문: ${news.title}\n\n출처: ${news.source}`,
          category: mapCategory(news.category),
          readingTime: 3,
          link: news.link,
          sourceUrl: news.link,
          publishedAt: news.date,
          source: news.source
        }));
        
        console.log('✅ 변환된 뉴스 데이터:', convertedNews.length + '개');
        
        return {
          date: new Date().toISOString().split('T')[0],
          lastUpdated: data.timestamp || new Date().toISOString(),
          news: convertedNews,
          investmentReport: formatInvestmentReport(data.insights)
        };
      }
    } else {
      console.warn('로컬 파일 응답 오류:', response.status);
    }
  } catch (error) {
    console.warn('❌ 로컬 파일에서 뉴스 로드 실패, 더미 데이터 사용:', error);
  }
  
  // 폴백: 더미 데이터 사용
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_BRIEFING_DATA);
    }, 500);
  });
}

function mapCategory(category: string): string {
  const categoryMap: { [key: string]: string } = {
    '금리': 'market',
    '주식': 'market',
    '환율': 'market',
    '부동산': 'domestic',
    '고용': 'domestic',
    '물가': 'domestic',
    '기업': 'domestic',
    '암호화폐': 'market',
    '정책': 'domestic',
    '국제': 'international',
    '반도체': 'domestic',
    '에너지': 'market'
  };
  
  return categoryMap[category] || 'domestic';
}

function formatInvestmentReport(insights: any): string {
  const topCategories = insights.topCategories || [];
  const recommendation = insights.recommendation || '분산 투자를 권장합니다.';
  const riskLevel = insights.riskLevel || '중간';
  
  let report = `## 📊 오늘의 투자 인사이트\n\n`;
  report += `### 주요 뉴스 카테고리\n\n`;
  
  topCategories.forEach((cat: any) => {
    report += `**${cat.category}** (${cat.count}개 뉴스)\n`;
    report += `• ${cat.topNews}\n\n`;
  });
  
  report += `### 투자 전략\n\n`;
  report += `**추천:** ${recommendation}\n`;
  report += `**위험 수준:** ${riskLevel}\n\n`;
  
  report += `### 주요 섹터\n\n`;
  insights.sectors?.forEach((sector: any) => {
    report += `• **${sector.name}**: ${sector.outlook} - ${sector.reason}\n`;
  });
  
  return report;
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else {
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  }
}

export function formatLastUpdated(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}
