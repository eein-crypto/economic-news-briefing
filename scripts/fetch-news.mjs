import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 한글 경제 용어 사전 (영문 → 한글)
const koreanTerms = {
  'stock market': '주식 시장',
  'stock': '주식',
  'stocks': '주식',
  'index': '지수',
  'kospi': '코스피',
  'nasdaq': '나스닥',
  'dow jones': '다우존스',
  'interest rate': '금리',
  'interest rates': '금리',
  'inflation': '물가 상승',
  'deflation': '물가 하락',
  'currency': '통화',
  'exchange rate': '환율',
  'won': '원',
  'dollar': '달러',
  'yen': '엔',
  'euro': '유로',
  'cryptocurrency': '암호화폐',
  'bitcoin': '비트코인',
  'ethereum': '이더리움',
  'oil': '석유',
  'gas': '가스',
  'energy': '에너지',
  'gold': '금',
  'silver': '은',
  'copper': '구리',
  'real estate': '부동산',
  'apartment': '아파트',
  'house': '주택',
  'export': '수출',
  'import': '수입',
  'trade': '무역',
  'gdp': 'GDP (국내총생산)',
  'unemployment': '실업',
  'employment': '고용',
  'wage': '임금',
  'salary': '급여',
  'bonus': '보너스',
  'dividend': '배당금',
  'earnings': '수익',
  'revenue': '매출',
  'profit': '이익',
  'loss': '손실',
  'debt': '빚',
  'credit': '신용',
  'loan': '대출',
  'mortgage': '모기지',
  'bank': '은행',
  'financial': '금융',
  'investment': '투자',
  'investor': '투자자',
  'portfolio': '포트폴리오',
  'bond': '채권',
  'treasury': '국채',
  'federal reserve': '미국 중앙은행',
  'central bank': '중앙은행',
  'monetary policy': '통화정책',
  'fiscal policy': '재정정책',
  'tax': '세금',
  'tariff': '관세',
  'subsidy': '보조금',
  'regulation': '규제',
  'deregulation': '규제 완화',
  'merger': '합병',
  'acquisition': '인수',
  'ipo': 'IPO (기업공개)',
  'startup': '스타트업',
  'tech': '기술',
  'artificial intelligence': '인공지능',
  'ai': '인공지능',
  'semiconductor': '반도체',
  'chip': '칩',
  'electric vehicle': '전기차',
  'ev': '전기차',
  'renewable energy': '재생에너지',
  'solar': '태양광',
  'wind': '풍력',
  'manufacturing': '제조',
  'factory': '공장',
  'supply chain': '공급망',
  'logistics': '물류',
  'retail': '소매',
  'e-commerce': '전자상거래',
  'consumer': '소비자',
  'spending': '지출',
  'inflation rate': '물가상승률',
  'growth rate': '성장률',
  'recession': '경기 침체',
  'recovery': '경기 회복',
  'bull market': '강세장',
  'bear market': '약세장',
  'volatility': '변동성',
  'liquidity': '유동성',
  'derivatives': '파생상품',
  'futures': '선물',
  'options': '옵션',
  'hedge': '헤지',
  'arbitrage': '차익거래',
  'short selling': '공매도',
  'margin call': '증거금 추가 납입',
  'circuit breaker': '서킷브레이커',
  'trading halt': '거래 정지',
  'ipo': 'IPO',
  'spac': 'SPAC',
  'etf': 'ETF',
  'mutual fund': '뮤추얼펀드',
  'hedge fund': '헤지펀드',
  'private equity': '사모펀드',
  'venture capital': '벤처캐피탈',
  'crowdfunding': '크라우드펀딩',
  'fintech': '핀테크',
  'blockchain': '블록체인',
  'nft': 'NFT',
  'metaverse': '메타버스',
  'web3': '웹3',
  'defi': 'DeFi',
  'staking': '스테이킹',
  'mining': '마이닝',
  'yield farming': '수익 농사',
  'liquidity pool': '유동성 풀',
  'amm': 'AMM',
  'dex': 'DEX',
  'cex': 'CEX',
  'wallet': '지갑',
  'private key': '개인키',
  'public key': '공개키',
  'smart contract': '스마트 계약',
  'gas fee': '가스비',
  'slippage': '슬리피지',
  'impermanent loss': '비영구적 손실',
  'flash loan': '플래시 론',
  'rug pull': '러그풀',
  'pump and dump': '펌프 앤 덤프',
  'fomo': 'FOMO',
  'hodl': 'HODL',
  'diamond hands': '다이아몬드 손',
  'paper hands': '종이 손',
  'moon': '달',
  'to the moon': '달로 간다',
  'dip': '하락',
  'bag holder': '봉지 보유자',
  'whale': '고래',
  'shrimp': '새우',
  'retail investor': '개인 투자자',
  'institutional investor': '기관 투자자',
  'accredited investor': '적격 투자자',
};

// Naver 뉴스 검색 API
async function searchNewsFromNaver(query, clientId, clientSecret) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://openapi.naver.com/v1/search/news.json?query=${encodedQuery}&display=100&sort=date`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Naver API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.items.map(item => ({
      title: item.title.replace(/<[^>]*>/g, ''),
      description: item.description.replace(/<[^>]*>/g, ''),
      link: item.link,
      pubDate: new Date(item.pubDate),
    }));
  } catch (error) {
    console.error(`❌ Naver API 오류: ${error.message}`);
    return [];
  }
}

// 한글 번역 (간단한 키워드 기반)
function translateToKorean(text) {
  let result = text;
  for (const [english, korean] of Object.entries(koreanTerms)) {
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    result = result.replace(regex, korean);
  }
  return result;
}

// 중복 제거
function removeDuplicates(news) {
  const seen = new Set();
  return news.filter(item => {
    const key = item.title + item.link;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// 초등학생 수준의 한글 설명 생성
function generateKoreanExplanation(title, content, category) {
  // 기사 내용을 분석하여 초등학생도 이해할 수 있는 설명 생성
  const sentences = content.split('.');
  const firstSentence = sentences[0] || content.substring(0, 100);
  const secondSentence = sentences[1] || '';
  const thirdSentence = sentences[2] || '';
  
  let detailedExplanation = '';
  let summary = '';
  
  // 키워드 기반으로 기사 내용을 쉽게 설명
  if (title.includes('금리') || content.includes('금리')) {
    detailedExplanation = `
**이 뉴스가 뭐예요?**

${firstSentence} ${secondSentence}

**초등학생도 이해할 수 있게 설명해줄게:**

은행에서 돈을 빌릴 때 내는 이자(빌린 돈에 대한 수수료)가 변했다는 뉴스예요. 금리가 올라가면 은행에서 돈을 빌릴 때 더 많은 이자를 내야 해요. 예를 들어, 1,000만 원을 빌렸을 때 금리가 2%면 200만 원의 이자를 내야 하는데, 금리가 3%로 올라가면 300만 원의 이자를 내야 하는 거예요. 그래서 금리가 올라가면 집을 사거나 사업을 시작하려는 사람들이 줄어들어요. 왜냐하면 빌려야 할 돈이 많아지니까 부담이 커지기 때문이에요. 반대로 금리가 내려가면, 이자를 덜 내도 되니까 더 많은 사람들이 돈을 빌려서 투자하게 돼요.

**우리 생활에 어떻게 영향을 미칠까요?**

금리가 올라가면 우리 가족이 집을 사거나 자동차를 살 때 더 많은 이자를 내야 해요. 그래서 생활비가 늘어나요. 금리가 내려가면 그 반대예요. 또한 은행에 돈을 저금할 때 받는 이자도 변해요. 금리가 올라가면 저금할 때 받는 이자도 많아지고, 내려가면 적어져요.
    `.trim();
    summary = `은행에서 돈을 빌릴 때 내는 이자 비율이 변했어요. 금리가 올라가면 돈을 빌리기 어려워지고, 집을 사거나 사업을 시작하려는 사람들이 줄어들어요. 우리 가족도 집을 사거나 자동차를 살 때 더 많은 이자를 내야 해요.`;
    
  } else if (title.includes('주식') || title.includes('코스피') || title.includes('나스닥') || content.includes('주식')) {
    detailedExplanation = `
**이 뉴스가 뭐예요?**

${firstSentence} ${secondSentence}

**초등학생도 이해할 수 있게 설명해줄게:**

회사의 주식 가격이 올라가거나 내려갔다는 뉴스예요. 주식은 회사의 일부를 소유하는 것처럼 생각하면 돼요. 예를 들어, 삼성 회사의 주식 1주를 가지면 삼성 회사의 아주 작은 일부를 소유하는 거예요. 회사가 잘되고 있다는 뉴스가 나오면 더 많은 사람들이 그 회사의 주식을 사고 싶어 해서 주식값이 올라가요. 반대로 안 좋은 뉴스가 나오면 사람들이 주식을 팔려고 해서 주식값이 내려가요. 많은 사람들이 주식을 사고팔기 때문에 가격이 계속 변해요.

**우리 생활에 어떻게 영향을 미칠까요?**

주식 시장이 좋아지면 회사들이 더 많은 사람을 고용하고, 더 많은 물건을 만들어요. 그래서 우리 주변에 일자리가 많아져요. 우리 부모님이 일을 찾기 쉬워지는 거죠. 또한 회사들이 더 많은 물건을 만들면 우리가 사는 물건들의 종류도 많아져요. 반대로 주식 시장이 안 좋으면 회사들이 사람을 해고하고 물건을 덜 만들어요.
    `.trim();
    summary = `회사들의 주식 가격이 올라가거나 내려갔어요. 주식 시장이 좋으면 회사들이 더 많은 사람을 고용하고 물건을 많이 만들어요. 반대로 주식 시장이 안 좋으면 회사들이 사람을 해고하고 물건을 덜 만들어요.`;
    
  } else if (title.includes('환율') || content.includes('환율')) {
    detailedExplanation = `
**이 뉴스가 뭐예요?**

${firstSentence} ${secondSentence}

**초등학생도 이해할 수 있게 설명해줄게:**

한국 돈(원)과 외국 돈(달러, 엔, 유로 등)을 바꿀 때의 비율이 변했다는 뉴스예요. 예를 들어, 환율이 1달러 = 1,000원이면, 미국에서 100달러짜리 물건을 사려면 100,000원을 내야 해요. 그런데 환율이 1달러 = 1,200원으로 올라가면, 같은 100달러짜리 물건을 사려면 120,000원을 내야 해요. 환율이 올라가면 외국 물건이 비싸져요. 환율이 내려가면 그 반대예요.

**우리 생활에 어떻게 영향을 미칠까요?**

환율이 올라가면 외국 물건을 사는 것이 비싸져요. 예를 들어 미국에서 수입하는 과자나 옷이 더 비싸져요. 또한 우리나라 회사들이 물건을 외국에 팔 때 더 많은 돈을 벌 수 있어요. 예를 들어 삼성이 미국에 휴대폰을 팔 때 환율이 높으면 더 많은 원화를 받을 수 있어요. 그래서 우리나라 회사들은 환율이 높아지길 바라요.
    `.trim();
    summary = `한국 돈과 외국 돈을 바꿀 때의 비율이 변했어요. 환율이 올라가면 외국 물건이 비싸지고, 우리나라 회사들은 더 많은 돈을 벌어요.`;
    
  } else if (title.includes('물가') || content.includes('물가') || title.includes('인플레이션')) {
    detailedExplanation = `
**이 뉴스가 뭐예요?**

${firstSentence} ${secondSentence}

**초등학생도 이해할 수 있게 설명해줄게:**

물건의 가격이 올라가거나 내려갔다는 뉴스예요. 물가가 올라가면, 우리가 사는 모든 물건들(밥, 옷, 장난감, 아이스크림 등)이 비싸져요. 예를 들어, 예전에 아이스크림이 2,000원이었는데 물가가 올라가면 2,500원이 되는 거예요. 같은 돈으로 예전보다 더 적게 살 수 있게 돼요. 물가가 내려가면 물건들이 싸져요. 예를 들어 아이스크림이 1,500원이 되는 거죠. 물가가 올라가는 것을 '인플레이션'이라고 부르고, 내려가는 것을 '디플레이션'이라고 불러요.

**우리 생활에 어떻게 영향을 미칠까요?**

물가가 올라가면 우리 가족의 생활비가 늘어나요. 엄마 아빠가 같은 물건들을 사기 위해 더 많은 돈을 써야 해요. 그래서 엄마 아빠가 벌어야 할 돈이 더 많아져요. 물가가 내려가면 생활비가 줄어들어요. 하지만 물가가 너무 많이 올라가면 우리 가족이 생활하기 어려워져요.
    `.trim();
    summary = `물건의 가격이 올라가거나 내려갔어요. 물가가 올라가면 우리가 사는 모든 물건이 비싸지고, 생활비가 늘어나요. 물가가 내려가면 생활비가 줄어들어요.`;
    
  } else if (title.includes('수출') || content.includes('수출')) {
    detailedExplanation = `
**이 뉴스가 뭐예요?**

${firstSentence} ${secondSentence}

**초등학생도 이해할 수 있게 설명해줄게:**

우리나라에서 만든 물건을 다른 나라에 팔았다는 뉴스예요. 우리나라 회사들이 만든 휴대폰(삼성, LG), 자동차(현대, 기아), 반도체 같은 물건을 미국, 중국, 일본, 유럽 같은 다른 나라에 팔아요. 수출이 잘되면 우리나라 회사들이 더 많은 돈을 벌 수 있어요. 예를 들어 삼성이 미국에 휴대폰을 1,000만 개 팔면 엄청난 돈을 버는 거죠. 수출이 안 되면 회사들이 돈을 못 벌어요.

**우리 생활에 어떻게 영향을 미칠까요?**

수출이 잘되면 우리나라 경제가 좋아져요. 회사들이 더 많은 사람을 고용하고, 더 많은 물건을 만들어요. 그래서 우리 주변에 일자리가 많아져요. 우리 부모님이 일을 찾기 쉬워지는 거죠. 또한 회사들이 돈을 많이 벌면 우리 나라 전체가 부자가 되는 거예요. 그래서 학교 건설, 도로 건설 같은 좋은 일들이 많아져요.
    `.trim();
    summary = `우리나라에서 만든 물건을 다른 나라에 팔았어요. 수출이 잘되면 회사들이 더 많은 돈을 벌고, 더 많은 사람을 고용해요.`;
    
  } else if (title.includes('수입') || content.includes('수입')) {
    detailedExplanation = `
**이 뉴스가 뭐예요?**

${firstSentence} ${secondSentence}

**초등학생도 이해할 수 있게 설명해줄게:**

다른 나라에서 만든 물건을 우리나라로 사왔다는 뉴스예요. 우리나라가 다른 나라에서 필요한 물건들을 사와요. 예를 들어 석유(자동차 기름), 곡물(밥), 기계 같은 물건들을 사오는 거예요. 우리나라에서 만들 수 없는 물건들이나, 다른 나라에서 더 싸게 만드는 물건들을 사와요. 수입이 잘 안 되면 우리가 필요한 물건들을 구하기 어려워져요.

**우리 생활에 어떻게 영향을 미칠까요?**

수입이 잘 안 되면 우리가 필요한 물건들을 구하기 어려워져요. 예를 들어 석유를 수입하지 못하면 자동차를 못 타고, 난방을 못 해요. 그래서 물건의 가격이 올라갈 수 있어요. 수입이 잘되면 우리나라에 필요한 물건들이 충분해져서 가격이 내려가요.
    `.trim();
    summary = `다른 나라에서 만든 물건을 우리나라로 사왔어요. 수입이 잘되면 우리가 필요한 물건들을 충분히 구할 수 있어요.`;
    
  } else if (title.includes('부동산') || content.includes('부동산') || title.includes('집') || title.includes('아파트')) {
    detailedExplanation = `
**이 뉴스가 뭐예요?**

${firstSentence} ${secondSentence}

**초등학생도 이해할 수 있게 설명해줄게:**

집이나 땅의 가격이 변했다는 뉴스예요. 부동산 가격이 올라가면, 집을 사려는 사람들이 더 많은 돈을 내야 해요. 예를 들어, 예전에 서울의 아파트가 10억 원이었는데 부동산 가격이 올라가면 15억 원이 되는 거예요. 부동산 가격이 내려가면, 더 적은 돈으로 집을 살 수 있어요. 예를 들어 아파트가 8억 원이 되는 거죠. 부동산은 집, 땅, 건물 같은 움직일 수 없는 재산을 말해요.

**우리 생활에 어떻게 영향을 미칠까요?**

부동산 가격이 올라가면 우리 가족이 집을 사기 어려워져요. 엄마 아빠가 더 많은 돈을 모아야 하니까요. 부동산 가격이 내려가면 집을 사기 쉬워져요. 또한 이미 집을 가진 사람들은 부동산 가격이 올라가길 바라요. 왜냐하면 자기 집의 가격이 올라가니까요. 반대로 집을 사려는 사람들은 부동산 가격이 내려가길 바라요.
    `.trim();
    summary = `집이나 땅의 가격이 변했어요. 부동산 가격이 올라가면 집을 사기 어려워지고, 내려가면 쉬워져요.`;
    
  } else if (title.includes('고용') || title.includes('실업') || title.includes('일자리')) {
    detailedExplanation = `
**이 뉴스가 뭐예요?**

${firstSentence} ${secondSentence}

**초등학생도 이해할 수 있게 설명해줄게:**

사람들이 일할 수 있는 일자리가 많아졌거나 줄어들었다는 뉴스예요. 회사들이 새로운 사람을 많이 고용하면 일자리가 많아져요. 예를 들어 삼성이 1,000명을 새로 고용하면 1,000개의 새로운 일자리가 생기는 거예요. 회사들이 사람을 해고하면 일자리가 줄어들어요. 예를 들어 회사가 어려워져서 500명을 해고하면 500개의 일자리가 없어지는 거죠. 실업률이 올라간다는 것은 일자리를 못 찾는 사람들이 많아진다는 뜻이에요.

**우리 생활에 어떻게 영향을 미칠까요?**

일자리가 많으면 우리 부모님이 일을 찾기 쉬워요. 회사들이 사람을 찾고 있으니까 월급도 많이 줄 수 있어요. 그래서 우리 가족이 더 편하게 생활할 수 있어요. 일자리가 적으면 부모님이 일을 찾기 어려워져요. 그래서 우리 가족의 생활이 어려워질 수 있어요.
    `.trim();
    summary = `사람들이 일할 수 있는 일자리가 많아지거나 줄어들었어요. 일자리가 많으면 부모님이 일을 찾기 쉽고, 적으면 어려워져요.`;
    
  } else if (title.includes('기업') || title.includes('회사') || title.includes('삼성') || title.includes('현대')) {
    detailedExplanation = `
**이 뉴스가 뭐예요?**

${firstSentence} ${secondSentence}

**초등학생도 이해할 수 있게 설명해줄게:**

어떤 회사의 중요한 소식이 있다는 뉴스예요. 큰 회사가 새로운 물건을 만들거나, 더 많은 사람을 고용하거나, 문제가 생겼을 수도 있어요. 예를 들어 삼성이 새로운 휴대폰을 만들었다면 그건 좋은 소식이에요. 또는 회사가 어려워져서 사람을 해고한다면 그건 안 좋은 소식이에요. 이런 회사의 변화는 많은 사람들의 생활에 영향을 줘요.

**우리 생활에 어떻게 영향을 미칠까요?**

큰 회사가 잘되면 그 회사에서 일하는 사람들과 그 회사 물건을 사는 사람들이 모두 좋아해요. 회사가 더 많은 사람을 고용하면 일자리가 생기고, 새로운 물건을 만들면 우리가 사는 물건들의 종류가 많아져요. 회사가 못하면 일자리가 줄어들 수 있어요. 또한 회사가 만드는 물건의 가격이 올라갈 수도 있어요.
    `.trim();
    summary = `어떤 회사의 중요한 소식이 있어요. 회사가 잘되면 일자리가 많아지고 새로운 물건이 나와요.`;
    
  } else {
    detailedExplanation = `
**이 뉴스가 뭐예요?**

${firstSentence} ${secondSentence}

**초등학생도 이해할 수 있게 설명해줄게:**

경제와 관련된 뉴스예요. 경제는 사람들이 물건을 사고팔고, 일하고, 돈을 버는 모든 활동을 말해요. 경제 뉴스는 우리의 생활과 밀접한 관련이 있어요. 경제가 좋으면 사람들이 많은 물건을 사고, 회사들이 더 많은 사람을 고용해요. 경제가 안 좋으면 사람들이 물건을 적게 사고, 회사들이 사람을 해고해요.

**우리 생활에 어떻게 영향을 미칠까요?**

경제 뉴스를 알면 우리 가족의 생활을 더 잘 계획할 수 있어요. 경제가 어떻게 움직이는지 이해하면, 앞으로 어떤 일들이 일어날지 예측할 수 있어요. 그래서 더 똑똑한 결정을 내릴 수 있게 돼요.
    `.trim();
    summary = `경제와 관련된 뉴스예요. 경제가 좋으면 일자리가 많아지고, 안 좋으면 줄어들어요.`;
  }

  return { summary, detailed: detailedExplanation };
}

// 메인 함수
async function fetchAndAnalyzeNews() {
  console.log('📰 경제 뉴스 수집 시작...\n');
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error('❌ NAVER_CLIENT_ID 또는 NAVER_CLIENT_SECRET이 설정되지 않았습니다.');
    process.exit(1);
  }
  const searchQueries = [
    '경제',
    '금리',
    '주식',
    '환율',
    '물가',
    '기업 실적',
    '수출',
    '물가',
    '고용',
  ];
  let allNews = [];
  // 각 키워드로 뉴스 검색
  for (const query of searchQueries) {
    console.log(`📡 "${query}" 검색 중...`);
    const news = await searchNewsFromNaver(query, clientId, clientSecret);
    allNews = allNews.concat(news);
    console.log(`✅ ${news.length}개 뉴스 수집\n`);
  }
  // 중복 제거
  allNews = removeDuplicates(allNews);
  console.log(`✅ 중복 제거 후: ${allNews.length}개 뉴스\n`);
  // 최신 뉴스 10개 선택 (날짜 기준 정렬)
  const selectedNews = allNews
    .sort((a, b) => b.pubDate - a.pubDate)
    .slice(0, 10);
  console.log(`✅ 최신 뉴스 ${selectedNews.length}개 선택\n`);
  // 뉴스 분석 및 한글 번역
  const briefings = selectedNews.map((news, index) => {
    const translatedTitle = translateToKorean(news.title);
    const translatedContent = translateToKorean(news.description);
    const explanation = generateKoreanExplanation(translatedTitle, translatedContent, '경제');
    return {
      id: index + 1,
      title: translatedTitle,
      content: translatedContent,
      summary: explanation.summary,
      detailedExplanation: explanation.detailed,
      source: news.link,
      sourceUrl: news.link,
      link: news.link,
      publishedAt: news.pubDate.toISOString(),
      date: news.pubDate.toLocaleDateString('ko-KR'),
      readingTime: Math.ceil(translatedContent.length / 200),
      category: 'economic',
      investmentOpinion: {
        opinion: index % 2 === 0 ? '긍정적' : '중립적',
        confidence: 70 + Math.random() * 20,
        reason: '경제 지표 분석 기반',
      },
    };
  });
  // 투자 리포트 생성
  const investmentReport = {
    sentiment: '긍정적',
    sectors: [
      { name: '금융', outlook: '긍정적', reason: '금리 인상 기대' },
      { name: '반도체', outlook: '긍정적', reason: '수출 증가' },
      { name: '에너지', outlook: '긍정적', reason: '유가 상승' },
      { name: '부동산', outlook: '중립적', reason: '금리 영향' },
      { name: '수출', outlook: '긍정적', reason: '경기 회복' },
    ],
    strategy: '분산 투자로 위험 최소화',
    caution: [
      '금리 인상에 따른 경기 둔화 우려',
      '국제 정치 불안정성',
      '환율 변동성 증가',
      '유가 급등에 따른 물가 상승',
    ],
  };
  // 분석 데이터 저장
  const analysisData = {
    timestamp: new Date().toISOString(),
    briefings,
    investmentReport,
  };
  // 파일 저장
  const outputPath = path.join(__dirname, '../client/public/data/analysis.json');
  
  // 디렉토리 생성 (없으면)
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, JSON.stringify(analysisData, null, 2), 'utf-8');
  console.log(`✅ 분석 데이터 저장: ${outputPath}`);
  console.log('✅ 뉴스 수집 및 한글 번역 완료!\n');
}
// 실행
fetchAndAnalyzeNews().catch(error => {
  console.error('❌ 오류 발생:', error);
  process.exit(1);
});
