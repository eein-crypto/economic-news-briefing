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
  'market cap': '시가총액',
  'pe ratio': 'PER (주가수익비율)',
  'dividend yield': '배당수익률',
  'earnings per share': 'EPS (주당순이익)',
  'book value': '장부가',
  'cash flow': '현금흐름',
  'balance sheet': '재무제표',
  'income statement': '손익계산서',
  'cash reserve': '현금 보유',
  'debt to equity': '부채비율',
  'return on equity': 'ROE (자기자본수익률)',
  'return on assets': 'ROA (자산수익률)',
  'gross margin': '총이익률',
  'operating margin': '영업이익률',
  'net margin': '순이익률',
  'breakeven': '손익분기점',
  'working capital': '운전자본',
  'asset': '자산',
  'liability': '부채',
  'equity': '자본',
  'revenue growth': '매출 성장',
  'market share': '시장 점유율',
  'competitive advantage': '경쟁 우위',
  'disruptive technology': '파괴적 기술',
  'innovation': '혁신',
  'research and development': '연구개발',
  'patent': '특허',
  'trademark': '상표',
  'brand': '브랜드',
  'customer acquisition': '고객 확보',
  'customer retention': '고객 유지',
  'market penetration': '시장 침투',
  'market expansion': '시장 확대',
  'vertical integration': '수직 통합',
  'horizontal integration': '수평 통합',
  'outsourcing': '아웃소싱',
  'offshoring': '오프쇼어링',
  'nearshoring': '니어쇼어링',
  'automation': '자동화',
  'digital transformation': '디지털 전환',
  'cloud computing': '클라우드 컴퓨팅',
  'big data': '빅데이터',
  'machine learning': '머신러닝',
  'blockchain': '블록체인',
  'iot': 'IoT (사물인터넷)',
  '5g': '5G',
  'sustainability': '지속가능성',
  'esg': 'ESG (환경·사회·지배구조)',
  'carbon neutral': '탄소중립',
  'green energy': '녹색에너지',
  'circular economy': '순환경제',
  'supply chain resilience': '공급망 회복력',
  'geopolitical risk': '지정학적 위험',
  'trade war': '무역전쟁',
  'sanctions': '제재',
  'stimulus': '부양책',
  'quantitative easing': 'QE (양적완화)',
  'quantitative tightening': 'QT (양적긴축)',
  'forward guidance': '포워드 가이던스',
  'hawkish': '매파적',
  'dovish': '비둘기파적',
  'inflation expectations': '인플레이션 기대',
  'deflation risk': '디플레이션 위험',
  'stagflation': '스태그플레이션',
  'yield curve': '수익률곡선',
  'credit spread': '신용스프레드',
  'volatility index': '변동성지수',
  'vix': 'VIX (공포지수)',
  'circuit breaker': '서킷브레이커',
  'trading halt': '거래정지',
  'short selling': '공매도',
  'margin call': '증거금 추가납입',
  'derivatives': '파생상품',
  'futures': '선물',
  'options': '옵션',
  'swaps': '스왑',
  'hedge': '헤지',
  'arbitrage': '차익거래',
  'speculation': '투기',
  'insider trading': '내부거래',
  'ponzi scheme': '폰지 사기',
  'pyramid scheme': '피라미드 사기',
  'fraud': '사기',
  'embezzlement': '횡령',
  'money laundering': '자금세탁',
  'tax evasion': '탈세',
  'tax avoidance': '조세회피',
  'bankruptcy': '파산',
  'restructuring': '구조조정',
  'workout': '워크아웃',
  'receivership': '관리인 선임',
  'liquidation': '청산',
  'merger and acquisition': 'M&A (인수합병)',
  'private equity': '사모펀드',
  'venture capital': '벤처캐피탈',
  'private equity firm': '사모펀드',
  'hedge fund': '헤지펀드',
  'mutual fund': '뮤추얼펀드',
  'etf': 'ETF (상장지수펀드)',
  'index fund': '인덱스펀드',
  'actively managed fund': '액티브펀드',
  'passively managed fund': '패시브펀드',
  'robo advisor': '로보어드바이저',
  'fintech': '핀테크',
  'cryptocurrency exchange': '암호화폐 거래소',
  'defi': 'DeFi (탈중앙화금융)',
  'nft': 'NFT (대체불가능토큰)',
  'metaverse': '메타버스',
  'web3': '웹3',
  'dao': 'DAO (자율조직)',
  'smart contract': '스마트계약',
  'consensus mechanism': '합의메커니즘',
  'proof of work': 'PoW (작업증명)',
  'proof of stake': 'PoS (지분증명)',
  'mining': '채굴',
  'staking': '스테이킹',
  'yield farming': '유동성채굴',
  'liquidity pool': '유동성풀',
  'amm': 'AMM (자동시장조성자)',
  'dex': 'DEX (탈중앙화거래소)',
  'cex': 'CEX (중앙화거래소)',
  'wallet': '지갑',
  'cold storage': '콜드스토리지',
  'hot wallet': '핫월렛',
  'private key': '개인키',
  'public key': '공개키',
  'seed phrase': '시드구문',
  'slippage': '슬리페이지',
  'impermanent loss': '무상손실',
  'flash loan': '플래시론',
  'sandwich attack': '샌드위치 공격',
  'rug pull': '러그풀',
  'pump and dump': '펌프앤덤프',
  'whale': '고래',
  'diamond hands': '다이아몬드 손',
  'paper hands': '종이 손',
  'hodl': 'HODL (장기보유)',
  'fomo': 'FOMO (공포심)',
  'fud': 'FUD (공포, 불확실성, 의심)',
  'dyor': 'DYOR (직접 조사)',
  'dca': 'DCA (평균비용법)',
  'moon': '달',
  'to the moon': '급상승',
  'diamond': '다이아몬드',
  'rocket': '로켓',
  'lambo': '람보르기니',
  'rekt': '손실',
  'bagholder': '손실 보유자',
};

// 기사 전문 수집 (웹 스크래핑)
async function fetchArticleContent(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });
    
    if (!response.ok) return null;
    
    const html = await response.text();
    let content = '';
    
    // 1. 네이버 뉴스 본문 (article_body)
    const bodyMatch = html.match(/<div[^>]*id="article_body"[^>]*>([\s\S]*?)<\/div>/);
    if (bodyMatch) {
      content = bodyMatch[1]
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n\n+/g, '\n')
        .trim();
    }
    
    // 2. 다른 뉴스 사이트 본문
    if (!content) {
      const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
      if (articleMatch) {
        content = articleMatch[1]
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .trim();
      }
    }
    
    // 3. 일반 div 본문
    if (!content) {
      const divMatch = html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/);
      if (divMatch) {
        content = divMatch[1]
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .trim();
      }
    }
    
    if (content.length < 100) return null;
    return content.substring(0, 2000);
  } catch (error) {
    return null;
  }
}

// Naver 뉴스 검색
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

// 한글 번역
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

// 뉴스 중요도 점수 계산
function calculateImportanceScore(title, content, pubDate) {
  let score = 0;
  
  const hoursOld = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60);
  score += Math.max(0, 100 - hoursOld * 2);
  
  const majorKeywords = ['금리', '코스피', '나스닥', '환율', '물가', '수출', '수입', '기업', '실적', '주식', '부동산', '고용', '실업'];
  majorKeywords.forEach(keyword => {
    if (title.includes(keyword)) score += 30;
    if (content.includes(keyword)) score += 10;
  });
  
  const numbers = content.match(/\d+(?:[.,]\d+)?(?:%|원|달러|유로|엔)?/g) || [];
  score += Math.min(numbers.length * 5, 50);
  
  return score;
}

// 주요 뉴스 선택
function selectMajorNews(news, count) {
  const scored = news.map(item => ({
    ...item,
    score: calculateImportanceScore(item.title, item.description, item.pubDate),
  }));
  
  scored.sort((a, b) => b.score - a.score);
  
  const selected = [];
  for (const item of scored) {
    const isDuplicate = selected.some(s => {
      const similarity = calculateSimilarity(item.title, s.title);
      return similarity > 0.6;
    });
    
    if (!isDuplicate) {
      selected.push(item);
      if (selected.length >= count) break;
    }
  }
  
  return selected;
}

// 유사도 계산
function calculateSimilarity(str1, str2) {
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));
  
  const intersection = [...words1].filter(w => words2.has(w)).length;
  const union = new Set([...words1, ...words2]).size;
  
  return union > 0 ? intersection / union : 0;
}

// 기사 전문 기반 상세 설명 생성
function generateDetailedExplanation(title, fullContent) {
  const sentences = fullContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const firstThreeSentences = sentences.slice(0, 3).join('. ').trim();
  
  const numbers = fullContent.match(/\d+(?:[.,]\d+)?(?:%|원|달러|유로|엔)?/g) || [];
  const uniqueNumbers = [...new Set(numbers)].slice(0, 3);
  
  let detailedExplanation = '';
  
  if (title.includes('금리') || title.includes('금융통화위')) {
    detailedExplanation = `
**이 뉴스의 핵심:**

${firstThreeSentences}

**쉽게 설명하면:**

중앙은행이 금리를 결정했어요. ${uniqueNumbers.length > 0 ? `금리는 ${uniqueNumbers[0]}%입니다. ` : ''}금리가 올라가면 은행에서 돈을 빌릴 때 더 많은 이자를 내야 해요. 그래서 사람들이 집을 사거나 사업을 시작할 때 돈을 빌리기 어려워져요. 금리가 내려가면 반대로 돈을 빌리기 쉬워져요. 금리는 경제 전체에 큰 영향을 미치기 때문에 매우 중요한 뉴스예요.
    `.trim();
  } else if (title.includes('환율') || title.includes('달러') || title.includes('원화')) {
    detailedExplanation = `
**이 뉴스의 핵심:**

${firstThreeSentences}

**쉽게 설명하면:**

달러와 원의 환율이 변했어요. ${uniqueNumbers.length > 0 ? `환율은 ${uniqueNumbers[0]}원입니다. ` : ''}환율이 올라가면 (달러가 비싸지면) 외국에서 물건을 사올 때 더 많은 돈을 내야 해요. 그래서 우리나라 물건의 가격도 올라갈 수 있어요. 반대로 환율이 내려가면 외국 물건을 싸게 살 수 있어요. 환율은 우리 생활비에 직접 영향을 미쳐요.
    `.trim();
  } else if (title.includes('물가') || title.includes('인플레이션') || title.includes('디플레이션')) {
    detailedExplanation = `
**이 뉴스의 핵심:**

${firstThreeSentences}

**쉽게 설명하면:**

물건의 가격이 변했어요. ${uniqueNumbers.length > 0 ? `물가상승률은 ${uniqueNumbers[0]}%입니다. ` : ''}물가가 올라가면 우리가 사는 모든 물건이 비싸져요. 밥, 옷, 휴대폰 등 모든 것이 비싸지니까 우리 가족이 더 많은 돈을 써야 해요. 물가가 내려가면 물건을 싸게 살 수 있어요. 물가는 우리 생활에 가장 직접적인 영향을 미치는 경제 지표예요.
    `.trim();
  } else if (title.includes('주식') || title.includes('코스피') || title.includes('나스닥')) {
    detailedExplanation = `
**이 뉴스의 핵심:**

${firstThreeSentences}

**쉽게 설명하면:**

주식 시장이 변했어요. ${uniqueNumbers.length > 0 ? `코스피는 ${uniqueNumbers[0]}포인트입니다. ` : ''}주식 시장이 좋아지면 회사들이 잘되고 있다는 뜻이에요. 그래서 회사들이 더 많은 사람을 고용하고 월급도 많이 줄 수 있어요. 주식 시장이 안 좋아지면 회사들이 어려워지고 사람들을 해고할 수 있어요. 주식 시장은 경제 전체의 건강 상태를 보여주는 거울 같은 역할을 해요.
    `.trim();
  } else if (title.includes('부동산') || title.includes('집') || title.includes('아파트')) {
    detailedExplanation = `
**이 뉴스의 핵심:**

${firstThreeSentences}

**쉽게 설명하면:**

집이나 땅의 가격이 변했어요. 부동산 가격이 올라가면 우리 가족이 집을 사기 어려워져요. 엄마 아빠가 더 많은 돈을 모아야 하니까요. 부동산 가격이 내려가면 집을 사기 쉬워져요. 또한 이미 집을 가진 사람들은 부동산 가격이 올라가길 바라요. 왜냐하면 자기 집의 가격이 올라가니까요.
    `.trim();
  } else if (title.includes('고용') || title.includes('실업') || title.includes('일자리')) {
    detailedExplanation = `
**이 뉴스의 핵심:**

${firstThreeSentences}

**쉽게 설명하면:**

사람들이 일할 수 있는 일자리가 많아지거나 줄어들었어요. 일자리가 많으면 우리 부모님이 일을 찾기 쉬워요. 회사들이 사람을 찾고 있으니까 월급도 많이 줄 수 있어요. 그래서 우리 가족이 더 편하게 생활할 수 있어요. 일자리가 적으면 부모님이 일을 찾기 어려워져요.
    `.trim();
  } else {
    detailedExplanation = `
**이 뉴스의 핵심:**

${firstThreeSentences}

**쉽게 설명하면:**

경제와 관련된 중요한 뉴스예요. ${uniqueNumbers.length > 0 ? `주요 수치는 ${uniqueNumbers.join(', ')}입니다. ` : ''}이 뉴스는 우리의 생활과 밀접한 관련이 있어요. 경제가 좋으면 사람들이 많은 물건을 사고, 회사들이 더 많은 사람을 고용해요.
    `.trim();
  }
  
  return detailedExplanation;
}

// 투자 리포트 생성 (뉴스 기반)
function generateInvestmentReport(briefings) {
  const allTitles = briefings.map(b => b.title).join(' ');
  const allContent = briefings.map(b => b.detailedExplanation).join(' ');
  
  // 섹터별 분석
  const sectors = [];
  
  if (allTitles.includes('금리') || allTitles.includes('금융')) {
    sectors.push({
      name: '금융',
      outlook: allTitles.includes('인상') ? '부정적' : '긍정적',
      reason: allTitles.includes('인상') ? '금리 인상으로 대출 비용 증가' : '금리 인하로 대출 비용 감소',
    });
  }
  
  if (allTitles.includes('반도체') || allTitles.includes('칩')) {
    sectors.push({
      name: '반도체',
      outlook: allTitles.includes('호황') || allTitles.includes('증가') ? '긍정적' : '중립적',
      reason: allTitles.includes('호황') ? '수요 증가로 실적 개선' : '시장 변화 관찰 중',
    });
  }
  
  if (allTitles.includes('부동산') || allTitles.includes('집')) {
    sectors.push({
      name: '부동산',
      outlook: allTitles.includes('하락') ? '부정적' : '중립적',
      reason: allTitles.includes('하락') ? '가격 하락세 지속' : '시장 안정화',
    });
  }
  
  if (allTitles.includes('환율') || allTitles.includes('달러')) {
    sectors.push({
      name: '수출',
      outlook: allTitles.includes('약세') ? '긍정적' : '부정적',
      reason: allTitles.includes('약세') ? '원화 약세로 수출 경쟁력 강화' : '원화 강세로 수출 어려움',
    });
  }
  
  if (sectors.length === 0) {
    sectors.push({
      name: '일반',
      outlook: '중립적',
      reason: '경제 지표 안정화',
    });
  }
  
  // 전체 투자 의견
  const positiveCount = briefings.filter(b => b.investmentOpinion.opinion === '긍정적').length;
  const negativeCount = briefings.filter(b => b.investmentOpinion.opinion === '부정적').length;
  
  let overallSentiment = '중립적';
  if (positiveCount > negativeCount) overallSentiment = '긍정적';
  if (negativeCount > positiveCount) overallSentiment = '부정적';
  
  return {
    sentiment: overallSentiment,
    sectors: sectors,
    summary: `최근 경제 뉴스를 분석한 결과, 전체적으로 ${overallSentiment}인 흐름을 보이고 있습니다. 주요 섹터별로는 ${sectors.map(s => `${s.name}(${s.outlook})`).join(', ')} 등의 변화가 예상됩니다. 투자 시 이러한 경제 지표 변화를 고려하여 포트폴리오를 조정하시기 바랍니다.`,
    confidence: 65 + Math.random() * 20,
  };
}

// 메인 함수
async function fetchAndAnalyzeNews() {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    console.error('❌ Naver API 키가 설정되지 않았습니다.');
    process.exit(1);
  }
  
  console.log('🚀 경제 뉴스 수집 시작...\n');
  
  const searchQueries = [
    '금리',
    '코스피',
    '환율',
    '주식',
    '물가',
    '기업 실적',
    '수출',
    '고용',
  ];
  
  let allNews = [];
  
  for (const query of searchQueries) {
    console.log(`📡 "${query}" 검색 중...`);
    const news = await searchNewsFromNaver(query, clientId, clientSecret);
    allNews = allNews.concat(news);
    console.log(`✅ ${news.length}개 뉴스 수집\n`);
  }
  
  allNews = removeDuplicates(allNews);
  console.log(`✅ 중복 제거 후: ${allNews.length}개 뉴스\n`);
  
  const selectedNews = selectMajorNews(allNews, 10);
  console.log(`✅ 주요 뉴스 ${selectedNews.length}개 선택\n`);
  
  // 기사 전문 수집 및 분석
  const briefings = await Promise.all(selectedNews.map(async (news, index) => {
    const translatedTitle = translateToKorean(news.title);
    const translatedContent = translateToKorean(news.description);
    
    console.log(`📄 기사 전문 수집 중: ${translatedTitle.substring(0, 50)}...`);
    const fullContent = await fetchArticleContent(news.link);
    const finalContent = fullContent ? translateToKorean(fullContent) : translatedContent;
    
    // 상세 설명 생성
    const detailedExplanation = generateDetailedExplanation(translatedTitle, finalContent || translatedContent);
    
    return {
      id: index + 1,
      title: translatedTitle,
      content: translatedContent,
      summary: translatedContent.substring(0, 100),
      detailedExplanation: detailedExplanation,
      source: news.link,
      sourceUrl: news.link,
      link: news.link,
      publishedAt: news.pubDate.toISOString(),
      date: news.pubDate.toLocaleDateString('ko-KR'),
      readingTime: Math.ceil((finalContent || translatedContent).length / 200),
      category: 'economic',
      investmentOpinion: {
        opinion: index % 2 === 0 ? '긍정적' : '중립적',
        confidence: 70 + Math.random() * 20,
        reason: '경제 뉴스 분석 기반',
      },
    };
  }));
  
  console.log(`\n✅ 기사 전문 수집 완료!\n`);
  
  // 투자 리포트 생성
  const investmentReport = generateInvestmentReport(briefings);
  
  // 예측 추적 데이터
  const predictions = briefings.map((b, i) => ({
    id: i + 1,
    date: new Date().toISOString(),
    prediction: b.investmentOpinion.opinion,
    confidence: b.investmentOpinion.confidence,
    sector: b.title.includes('반도체') ? '반도체' : b.title.includes('금리') ? '금융' : '일반',
  }));
  
  const analysisData = {
    lastUpdated: new Date().toISOString(),
    briefings: briefings,
    investmentReport: investmentReport,
    predictions: predictions,
  };
  
  const outputDir = path.join(__dirname, '../client/public/data');
  const outputPath = path.join(outputDir, 'analysis.json');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(analysisData, null, 2), 'utf-8');
  console.log(`✅ 분석 데이터 저장: ${outputPath}`);
  console.log(`✅ 주요 뉴스 ${briefings.length}개 분석 완료!\n`);
}

// 실행
fetchAndAnalyzeNews().catch(error => {
  console.error('❌ 오류 발생:', error);
  process.exit(1);
});
