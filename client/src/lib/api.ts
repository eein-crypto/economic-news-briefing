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
      summary: '원화 가치가 떨어지고 있어요. 이것은 마치 우리나라 돈의 가치가 미국 돈에 비해 낮아지는 것처럼 생각할 수 있어요. 이런 일이 일어나면 외국에서 물건을 사올 때 더 비싸지게 돼요.',
      category: 'market',
      readingTime: 2,
      link: 'https://www.hankyung.com/economy',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: '한국경제'
    },
    {
      id: '2',
      title: '유가 급등에 원전 가동률 80%까지 높인다',
      summary: '기름값이 많이 올라가고 있어요. 그래서 정부는 원자력 발전소를 더 많이 돌리기로 결정했어요. 원자력 발전은 기름을 쓰지 않으니까 기름값이 올라도 영향을 덜 받을 수 있어요.',
      category: 'domestic',
      readingTime: 3,
      link: 'https://www.hankyung.com/economy',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: '한국경제'
    },
    {
      id: '3',
      title: '중국, 7나노 반도체 제조 공정 준비',
      summary: '중국이 아주 작은 컴퓨터 칩을 만드는 기술을 개발했어요. 이 기술은 매우 어려워서 세계에서 몇몇 나라만 할 수 있었는데, 이제 중국도 할 수 있게 된 거예요.',
      category: 'international',
      readingTime: 2,
      link: 'https://www.hankyung.com/economy',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      source: '로이터'
    },
    {
      id: '4',
      title: '기초연금 인상률 소득별 차등 적용',
      summary: '정부가 노인분들이 받는 기초연금을 다르게 올리기로 했어요. 잘사는 노인분들은 조금만 올리고, 어려운 노인분들은 더 많이 올려주는 거예요.',
      category: 'domestic',
      readingTime: 2,
      link: 'https://www.hankyung.com/economy',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      source: '한국경제'
    },
    {
      id: '5',
      title: '미국산 계란 5790원으로 올라',
      summary: '닭이 병에 걸려서 계란이 부족해졌어요. 그래서 미국에서 계란을 사와야 하는데, 계란 가격이 많이 올랐어요. 이건 마치 우리가 사고 싶은 물건이 없을 때 다른 곳에서 비싸게 사오는 것과 같아요.',
      category: 'market',
      readingTime: 2,
      link: 'https://www.hankyung.com/economy',
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      source: '한국경제'
    }
  ],
  investmentReport: '친구들, 요즘 경제가 어떻게 흘러가고 있는지 알아봤어요! 기름값이 올라가고 있고, 원화 가치가 떨어지고 있어요. 이럴 때는 어떻게 해야 할까요? 투자는 마치 씨앗을 심는 것과 같아요. 어떤 씨앗이 잘 자랄지 미리 알아보고, 여러 종류의 씨앗을 심어두면 더 좋겠죠? 지금은 안정적인 투자를 생각해 보는 것이 좋을 것 같아요!'
};

export async function fetchBriefingData(): Promise<BriefingData> {
  // In production, fetch from API or static file
  // For now, return mock data
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_BRIEFING_DATA);
    }, 500);
  });
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
