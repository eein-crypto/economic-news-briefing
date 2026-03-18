import { BriefingData } from './types';

export async function fetchBriefingData(): Promise<BriefingData> {
  try {
    // Try to fetch from static JSON file
    const response = await fetch('/data/analysis.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the data to match BriefingData interface
    const briefingData: BriefingData = {
      date: new Date(data.timestamp).toISOString().split('T')[0],
      lastUpdated: data.timestamp,
      news: data.topNews.map((news: any) => ({
        id: news.id,
        title: news.title,
        summary: news.summary,
        detailedExplanation: news.detailedExplanation,
        investmentOpinion: news.investmentOpinion,
        category: news.category,
        readingTime: news.readingTime,
        link: news.link,
        sourceUrl: news.sourceUrl,
        publishedAt: news.publishedAt,
        source: news.source
      })),
      investmentReport: generateInvestmentReport(data.insights || { sectors: [], recommendation: '', marketSentiment: '긍정적' }),
      predictions: generatePredictions(data.topNews)
    };
    
    return briefingData;
  } catch (error) {
    console.error('Failed to fetch briefing data:', error);
    // Return empty data on error
    return {
      date: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString(),
      news: [],
      investmentReport: '데이터를 불러올 수 없습니다.',
      predictions: []
    };
  }
}

/**
 * 투자 리포트 생성
 */
function generateInvestmentReport(insights: any): string {
  const sectors = insights.sectors || [];
  const recommendation = insights.recommendation || '';
  const marketSentiment = insights.marketSentiment || '중립';
  
  let report = `## 📊 오늘의 경제 분석 및 투자 리포트\n\n`;
  report += `### 시장 심리\n**${marketSentiment}**\n\n`;
  report += `### 투자 권장사항\n${recommendation}\n\n`;
  report += `### 섹터별 전망\n\n`;
  
  sectors.forEach((sector: any) => {
    const emoji = sector.outlook === '긍정적' ? '📈' : sector.outlook === '부정적' ? '📉' : '➡️';
    report += `${emoji} **${sector.name}**: ${sector.outlook}\n`;
    report += `   - ${sector.reason}\n\n`;
  });
  
  report += `### 투자 전략\n\n`;
  report += `**분산 투자의 중요성**\n`;
  report += `투자는 마치 여러 종류의 씨앗을 심는 것과 같습니다. 한 가지 씨앗만 심으면 그 씨앗이 자라지 않을 때 손실이 크지만, 여러 종류의 씨앗을 심으면 일부가 자라지 않아도 다른 것이 자라서 전체적으로는 수확을 할 수 있습니다.\n\n`;
  report += `**주의할 점**\n\n`;
  report += `경제는 항상 변합니다. 오늘의 예측이 내일 틀릴 수도 있습니다. 따라서 다음과 같은 점을 주의해야 합니다:\n\n`;
  report += `1. **계속 학습하기**: 경제 뉴스를 꾸준히 읽고 배워야 합니다.\n`;
  report += `2. **장기 관점 유지**: 단기 변동에 흔들리지 말고 장기 관점을 유지해야 합니다.\n`;
  report += `3. **위험 관리**: 손실을 감수할 수 있는 범위 내에서 투자해야 합니다.\n`;
  report += `4. **전문가 상담**: 중요한 투자 결정 전에 전문가와 상담하는 것이 좋습니다.`;
  
  return report;
}

/**
 * 예측 데이터 생성
 */
function generatePredictions(news: any[]): any[] {
  return news.slice(0, 5).map((item: any, index: number) => ({
    id: `prediction_${index}`,
    title: item.title,
    prediction: item.investmentOpinion?.opinion || '정보를 수집 중입니다.',
    sentiment: item.investmentOpinion?.sentiment || 'neutral',
    confidence: item.investmentOpinion?.confidence || 0.7,
    createdAt: item.publishedAt,
    actualOutcome: null,
    accuracy: null
  }));
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
