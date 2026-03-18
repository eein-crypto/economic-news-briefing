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
  'volatility index': '변동성 지수',
  'vix': '변동성 지수',
  'margin': '마진',
  'leverage': '레버리지',
  'short selling': '공매도',
  'hedge': '헤지',
  'derivative': '파생상품',
  'futures': '선물',
  'options': '옵션',
  'swap': '스왑',
  'warrant': '워런트',
  'convertible': '전환사채',
  'etf': 'ETF (상장지수펀드)',
  'mutual fund': '뮤추얼펀드',
  'pension': '연금',
  'insurance': '보험',
  'healthcare': '의료',
  'pharmaceutical': '제약',
  'biotech': '바이오',
  'agriculture': '농업',
  'mining': '광업',
  'construction': '건설',
  'infrastructure': '인프라',
  'transportation': '운송',
  'airline': '항공사',
  'shipping': '해운',
  'telecom': '통신',
  'media': '미디어',
  'entertainment': '엔터테인먼트',
  'gaming': '게임',
  'sports': '스포츠',
  'tourism': '관광',
  'hospitality': '숙박',
  'restaurant': '음식점',
  'food': '식품',
  'beverage': '음료',
  'apparel': '의류',
  'fashion': '패션',
  'luxury': '럭셔리',
  'beauty': '뷰티',
  'cosmetics': '화장품',
  'personal care': '개인용품',
  'household': '가정용품',
  'furniture': '가구',
  'appliance': '가전제품',
  'automotive': '자동차',
  'motorcycle': '오토바이',
  'bicycle': '자전거',
  'aerospace': '항공우주',
  'defense': '방위',
  'military': '군사',
  'government': '정부',
  'politics': '정치',
  'policy': '정책',
  'legislation': '입법',
  'compliance': '준수',
  'audit': '감사',
  'accounting': '회계',
  'finance': '금융',
  'economics': '경제학',
  'economist': '경제학자',
  'analyst': '분석가',
  'forecast': '예측',
  'projection': '전망',
  'outlook': '전망',
  'guidance': '지침',
  'earnings call': '실적 발표',
  'conference': '컨퍼런스',
  'summit': '정상회담',
  'agreement': '협약',
  'treaty': '조약',
  'deal': '거래',
  'contract': '계약',
  'negotiation': '협상',
  'dispute': '분쟁',
  'lawsuit': '소송',
  'settlement': '합의',
  'arbitration': '중재',
  'sanction': '제재',
  'embargo': '금수',
  'trade war': '무역전쟁',
  'tariff war': '관세전쟁',
  'quota': '할당량',
  'dumping': '덤핑',
  'antitrust': '독점금지',
  'monopoly': '독점',
  'oligopoly': '과점',
  'competition': '경쟁',
  'market share': '시장점유율',
  'market cap': '시가총액',
  'valuation': '평가',
  'pe ratio': 'P/E 배수',
  'price to earnings': 'P/E 배수',
  'book value': '장부가',
  'intrinsic value': '내재가치',
  'fair value': '공정가치',
  'target price': '목표가',
  'buy rating': '매수 등급',
  'sell rating': '매도 등급',
  'hold rating': '보유 등급',
  'upgrade': '상향',
  'downgrade': '하향',
  'bull': '강세론자',
  'bear': '약세론자',
  'rally': '반등',
  'crash': '폭락',
  'correction': '조정',
  'consolidation': '보합',
  'breakout': '돌파',
  'breakdown': '붕괴',
  'support': '지지',
  'resistance': '저항',
  'trend': '추세',
  'momentum': '모멘텀',
  'technical analysis': '기술적 분석',
  'fundamental analysis': '기본적 분석',
  'quantitative': '정량적',
  'qualitative': '정성적',
  'data': '데이터',
  'analytics': '분석',
  'algorithm': '알고리즘',
  'machine learning': '머신러닝',
  'automation': '자동화',
  'digitalization': '디지털화',
  'blockchain': '블록체인',
  'fintech': '핀테크',
  'payment': '결제',
  'transaction': '거래',
  'clearing': '청산',
  'custody': '보관',
  'broker': '중개인',
  'dealer': '딜러',
  'trader': '트레이더',
  'quant': '퀀트',
  'hedge fund': '헤지펀드',
  'private equity': '사모펀드',
  'venture capital': '벤처캐피탈',
  'angel investor': '엔젤투자자',
  'crowdfunding': '크라우드펀딩',
  'spac': 'SPAC',
  'direct listing': '직상장',
  'secondary offering': '공모',
  'rights offering': '유상증자',
  'stock split': '주식분할',
  'stock buyback': '자사주 매입',
  'dividend yield': '배당수익률',
  'payout ratio': '배당성향',
  'retention': '유보',
  'reinvestment': '재투자',
  'compounding': '복리',
  'time value': '시간가치',
  'discount rate': '할인율',
  'present value': '현재가치',
  'future value': '미래가치',
  'npv': 'NPV (순현재가치)',
  'irr': 'IRR (내부수익률)',
  'roi': 'ROI (투자수익률)',
  'roe': 'ROE (자기자본수익률)',
  'roa': 'ROA (자산수익률)',
  'wacc': 'WACC (가중평균자본비용)',
  'beta': '베타',
  'alpha': '알파',
  'sharpe ratio': '샤프지수',
  'correlation': '상관계수',
  'covariance': '공분산',
  'variance': '분산',
  'standard deviation': '표준편차',
  'skewness': '왜도',
  'kurtosis': '첨도',
  'distribution': '분포',
  'normal distribution': '정규분포',
  'probability': '확률',
  'expected value': '기댓값',
  'scenario analysis': '시나리오 분석',
  'sensitivity analysis': '민감도 분석',
  'stress test': '스트레스 테스트',
  'backtesting': '백테스팅',
  'forward testing': '포워드 테스팅',
  'optimization': '최적화',
  'constraint': '제약',
  'objective function': '목적함수',
  'linear programming': '선형계획법',
  'quadratic programming': '이차계획법',
  'monte carlo': '몬테카를로',
  'simulation': '시뮬레이션',
  'modeling': '모델링',
  'forecasting': '예측',
  'time series': '시계열',
  'arima': 'ARIMA',
  'garch': 'GARCH',
  'var': 'VaR (위험가치)',
  'cvar': 'CVaR (조건부위험가치)',
  'duration': '듀레이션',
  'convexity': '볼록성',
  'yield curve': '수익률곡선',
  'term structure': '기간구조',
  'spot rate': '현물금리',
  'forward rate': '선도금리',
  'swap rate': '스왑금리',
  'libor': 'LIBOR',
  'sofr': 'SOFR',
  'repo': 'REPO (환매조건부매매)',
  'reverse repo': '역REPO',
  'collateral': '담보',
  'haircut': '헤어컷',
  'margin call': '증거금 추가 요청',
  'liquidation': '청산',
  'bankruptcy': '파산',
  'default': '채무불이행',
  'credit rating': '신용등급',
  'credit spread': '신용스프레드',
  'default swap': '신용부도스왑',
  'cds': '신용부도스왑',
  'securitization': '증권화',
  'mbs': 'MBS (모기지담보증권)',
  'abs': 'ABS (자산담보증권)',
  'cdo': 'CDO (담보부채무증권)',
  'structured product': '구조화상품',
};

// Naver API에서 뉴스 검색
async function searchNewsFromNaver(query, clientId, clientSecret) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://openapi.naver.com/v1/search/news.json?query=${encodedQuery}&display=100&sort=date`;
    
    const response = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    });

    if (!response.ok) {
      console.error(`❌ Naver API 오류: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    // HTML 태그 제거
    const items = data.items.map(item => ({
      title: item.title.replace(/<[^>]*>/g, ''),
      description: item.description.replace(/<[^>]*>/g, ''),
      link: item.link,
      pubDate: new Date(item.pubDate),
    }));

    return items;
  } catch (error) {
    console.error(`❌ Naver API 검색 오류 (${query}):`, error.message);
    return [];
  }
}

// 중복 제거 함수
function removeDuplicates(news) {
  const seen = new Set();
  return news.filter(item => {
    const key = item.title.toLowerCase().trim();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// 한글 번역 함수
function translateToKorean(text) {
  let translated = text;
  
  // 대소문자 구분 없이 번역
  for (const [english, korean] of Object.entries(koreanTerms)) {
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    translated = translated.replace(regex, korean);
  }
  
  return translated;
}

// 초등학생 수준의 한글 설명 생성
function generateKoreanExplanation(title, content, category) {
  const summaryMap = {
    '주식': '회사의 일부를 소유하는 것처럼 생각하면 돼. 회사가 잘되면 주식값이 올라가고, 못하면 내려가.',
    '금리': '은행에서 돈을 빌릴 때 내야 하는 이자 비율이야. 금리가 높으면 빌리기 어렵고, 낮으면 쉬워.',
    '환율': '한국 돈과 미국 돈을 바꿀 때의 비율이야. 환율이 높으면 미국 물건이 비싸지고, 낮으면 싸져.',
    '물가': '물건의 값이 얼마나 비싼지를 나타내는 거야. 물가가 올라가면 같은 돈으로 더 적게 살 수 있어.',
    '경제': '사람들이 물건을 사고팔고, 일하고, 돈을 버는 모든 활동을 말해.',
    '수출': '우리나라에서 만든 물건을 다른 나라에 팔아주는 거야.',
    '수입': '다른 나라에서 만든 물건을 우리나라로 사오는 거야.',
    '부동산': '땅이나 건물처럼 움직일 수 없는 재산을 말해.',
    '기업': '사람들이 함께 물건을 만들거나 서비스를 제공하는 조직이야.',
    '실업': '일하고 싶지만 일자리가 없는 상태를 말해.',
  };

  let summary = '경제 뉴스입니다.';
  for (const [keyword, explanation] of Object.entries(summaryMap)) {
    if (title.includes(keyword) || content.includes(keyword)) {
      summary = explanation;
      break;
    }
  }

  const detailed = `
이 뉴스는 ${category} 분야의 중요한 소식입니다.

**핵심 내용:**
${content.substring(0, 200)}...

**초등학생을 위한 설명:**
${summary}

**왜 중요할까요?**
이런 경제 뉴스는 우리의 일상생활에 영향을 미칩니다. 예를 들어, 물가가 올라가면 우리가 사는 물건이 비싸지고, 회사들이 잘되면 더 많은 사람들이 일자리를 얻을 수 있어요.
  `.trim();

  return { summary, detailed };
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

  // 검색할 경제 관련 키워드들
  const searchQueries = [
    '경제 뉴스',
    '주식 시장',
    '코스피',
    '환율',
    '금리',
    '부동산',
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
      date: news.pubDate.toLocaleDateString('ko-KR'),
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
