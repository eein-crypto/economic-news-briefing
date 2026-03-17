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
      summary: '원화 가치가 떨어지고 있어요. 이것은 마치 우리나라 돈의 가치가 미국 돈에 비해 낮아지는 것처럼 생각할 수 있어요.',
      detailedExplanation: '환율이란 우리나라 돈(원)과 미국 돈(달러)을 바꿀 때 몇 개의 원을 줘야 하는지를 나타내는 거예요. 예를 들어 환율이 1500원이라는 것은 달러 1개를 사려면 원 1500개를 줘야 한다는 뜻이에요.\n\n환율이 올라간다는 것은 원화 가치가 내려간다는 의미예요. 왜 이런 일이 생길까요? 여러 가지 이유가 있어요. 미국 경제가 좋아지면 달러 가치가 올라가고, 한국 경제가 어려워지면 원화 가치가 내려가요.\n\n환율이 올라가면 우리가 외국에서 물건을 살 때 더 비싸져요. 예를 들어 미국 제품을 사고 싶을 때, 환율이 1400원일 때는 100달러짜리 물건이 140,000원이지만, 환율이 1500원이 되면 150,000원이 되는 거죠. 하지만 한국 제품을 외국에 팔 때는 더 싸지니까 한국 회사들은 더 많이 팔 수 있어요.',
      category: 'market',
      readingTime: 4,
      link: 'https://www.hankyung.com/economy',
      sourceUrl: 'https://www.hankyung.com/economy',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: '한국경제'
    },
    {
      id: '2',
      title: '유가 급등에 원전 가동률 80%까지 높인다',
      summary: '기름값이 많이 올라가고 있어요. 그래서 정부는 원자력 발전소를 더 많이 돌리기로 결정했어요.',
      detailedExplanation: '유가란 석유의 가격을 말해요. 최근에 석유 가격이 많이 올라갔어요. 왜 그럴까요? 여러 나라에서 석유를 많이 사용하려고 하는데, 석유를 생산하는 나라에서는 그만큼 많이 만들지 못하기 때문이에요. 마치 인기 있는 장난감이 부족해서 가격이 올라가는 것처럼요.\n\n석유 가격이 올라가면 전기료도 올라가요. 왜냐하면 많은 발전소에서 석유를 태워서 전기를 만들기 때문이에요. 그래서 정부는 다른 방법으로 전기를 만들기로 했어요. 바로 원자력 발전이에요.\n\n원자력 발전은 우라늄이라는 물질을 사용해서 엄청난 열을 만들어 전기를 생산하는 거예요. 석유를 쓰지 않으니까 유가가 올라도 영향을 덜 받아요. 하지만 원자력 발전은 안전하게 관리해야 하고, 방사능 폐기물 처리가 어려워요. 그래도 환경을 생각하면 좋은 방법이라고 생각하는 사람들이 많아요.',
      category: 'domestic',
      readingTime: 5,
      link: 'https://www.hankyung.com/economy',
      sourceUrl: 'https://www.hankyung.com/economy',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: '한국경제'
    },
    {
      id: '3',
      title: '중국, 7나노 반도체 제조 공정 준비',
      summary: '중국이 아주 작은 컴퓨터 칩을 만드는 기술을 개발했어요. 이 기술은 매우 어려워서 세계에서 몇몇 나라만 할 수 있었는데, 이제 중국도 할 수 있게 된 거예요.',
      detailedExplanation: '반도체란 컴퓨터, 스마트폰, TV 등 모든 전자제품에 들어가는 아주 작은 부품이에요. 반도체는 아주 정밀하게 만들어야 해요.\n\n\"7나노\"라는 것은 반도체에 들어가는 회로의 크기를 나타내는 거예요. 나노는 아주 작은 단위로, 1나노는 1미터의 10억 분의 1이에요. 7나노 반도체는 정말 정말 작은 회로를 가지고 있다는 뜻이에요.\n\n반도체를 작게 만들수록 더 강력하고 빠르고 전기를 적게 써요. 그래서 모든 나라가 더 작은 반도체를 만들려고 노력하고 있어요. 하지만 이 기술은 정말 어려워서 미국(인텔, 퀄컴), 한국(삼성, SK하이닉스), 대만(TSMC) 같은 나라들만 할 수 있었어요.\n\n이제 중국도 7나노 반도체를 만들 수 있다고 했으니, 이것은 세계 반도체 시장에 큰 변화를 가져올 거예요. 한국의 반도체 회사들도 더 열심히 노력해야 해요.',
      category: 'international',
      readingTime: 5,
      link: 'https://www.reuters.com',
      sourceUrl: 'https://www.reuters.com',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      source: '로이터'
    },
    {
      id: '4',
      title: '기초연금 인상률 소득별 차등 적용',
      summary: '정부가 노인분들이 받는 기초연금을 다르게 올리기로 했어요. 잘사는 노인분들은 조금만 올리고, 어려운 노인분들은 더 많이 올려주는 거예요.',
      detailedExplanation: '기초연금이란 나이가 많으신 어르신들이 받는 돈이에요. 일을 할 수 없는 나이가 되었을 때 생활비로 받는 거죠.\n\n정부가 기초연금을 올리기로 했는데, 모두 똑같이 올리지 않고 소득에 따라 다르게 올리기로 했어요. 이것을 \"차등 적용\"이라고 해요.\n\n예를 들어, 돈이 많지 않은 어르신은 기초연금을 10% 올려주고, 돈이 많은 어르신은 5% 올려주는 식이에요. 이렇게 하면 어려운 어르신들을 더 많이 도와줄 수 있어요.\n\n이것은 \"형평성\"이라는 개념이에요. 모두를 똑같이 대하는 것도 중요하지만, 어려운 사람을 더 도와주는 것도 중요하다는 생각이에요. 마치 키가 작은 친구에게는 더 높은 의자를 주고, 키가 큰 친구에게는 낮은 의자를 주는 것처럼요.',
      category: 'domestic',
      readingTime: 4,
      link: 'https://www.hankyung.com/economy',
      sourceUrl: 'https://www.hankyung.com/economy',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      source: '한국경제'
    },
    {
      id: '5',
      title: '미국산 계란 5790원으로 올라',
      summary: '닭이 병에 걸려서 계란이 부족해졌어요. 그래서 미국에서 계란을 사와야 하는데, 계란 가격이 많이 올랐어요.',
      detailedExplanation: '최근에 미국에서 조류독감이라는 병이 퍼졌어요. 이 병에 걸린 닭들은 계란을 낳을 수 없고, 결국 죽게 돼요. 그래서 미국에서 계란이 많이 부족해졌어요.\n\n계란이 부족하면 어떻게 될까요? 공급이 적으니까 가격이 올라가요. 마치 인기 있는 게임기가 부족해서 가격이 올라가는 것처럼요.\n\n한국도 미국에서 계란을 사와야 하는데, 미국에서 계란이 비싸지니까 한국에서 사는 가격도 올라가요. 게다가 한국에서도 조류독감이 퍼져서 닭이 줄어들고 있어요.\n\n계란 가격이 올라가면 계란을 사용해서 만드는 음식들(계란말이, 계란국, 케이크 등)도 비싸져요. 이런 상황을 \"공급 부족\"이라고 해요. 공급이 줄어들면 가격이 올라가는 것은 경제의 기본 원리예요.',
      category: 'market',
      readingTime: 4,
      link: 'https://www.hankyung.com/economy',
      sourceUrl: 'https://www.hankyung.com/economy',
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      source: '한국경제'
    }
  ],
  investmentReport: '친구들, 요즘 경제가 어떻게 흘러가고 있는지 알아봤어요!\n\n📊 **현재 경제 상황:**\n• 원화 가치가 내려가고 있어요 (환율 상승)\n• 기름값이 올라가고 있어요 (유가 상승)\n• 계란 같은 생활용품 가격이 올라가고 있어요\n• 중국의 기술 발전으로 세계 경제 구도가 바뀌고 있어요\n\n💡 **투자 관점:**\n1. **에너지 회사들**: 유가가 올라가니까 석유 회사들이 더 많은 돈을 벌 수 있어요. 하지만 원자력 발전이 늘어나면 석유 수요가 줄어들 수도 있어요.\n\n2. **반도체 회사들**: 중국이 기술을 따라잡고 있으니까 한국의 삼성, SK하이닉스 같은 회사들은 더 열심히 노력해야 해요. 하지만 반도체는 계속 필요하니까 좋은 회사들은 계속 성장할 거예요.\n\n3. **농업 회사들**: 계란, 곡물 같은 것들이 부족해지니까 가격이 올라가요. 농업 회사들이 더 많은 돈을 벌 수 있어요.\n\n4. **수출 회사들**: 원화 가치가 내려가니까 한국 제품을 외국에 팔기가 더 쉬워져요. 한국 회사들이 더 많이 팔 수 있다는 뜻이에요.\n\n🎯 **투자 전략:**\n투자는 마치 씨앗을 심는 것과 같아요. 어떤 씨앗이 잘 자랄지 미리 알아보고, 여러 종류의 씨앗을 심어두면 더 좋겠죠? 지금은 안정적인 투자를 생각해 보는 것이 좋을 것 같아요. 한 가지 회사의 주식만 사기보다는 여러 회사, 여러 산업의 주식을 조금씩 사는 것이 더 안전해요.\n\n⚠️ **주의할 점:**\n경제는 항상 변해요. 오늘의 예측이 내일 틀릴 수도 있어요. 그래서 계속 뉴스를 읽고 배우는 것이 중요해요!'
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
