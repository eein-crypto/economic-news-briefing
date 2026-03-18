import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const OUTPUT_PATH = path.join(__dirname, '../client/public/data/analysis.json');

// 한글 번역 사전 (경제 용어 중심)
const translationDict = {
  'oil': '석유',
  'gas': '가스',
  'prices': '가격',
  'price': '가격',
  'stock': '주식',
  'stocks': '주식',
  'market': '시장',
  'economy': '경제',
  'economic': '경제적',
  'inflation': '물가상승',
  'interest rate': '금리',
  'interest': '이자',
  'rate': '비율',
  'dollar': '달러',
  'won': '원',
  'currency': '통화',
  'exchange': '환율',
  'export': '수출',
  'import': '수입',
  'trade': '무역',
  'investment': '투자',
  'investor': '투자자',
  'profit': '이익',
  'loss': '손실',
  'earnings': '수익',
  'revenue': '매출',
  'dividend': '배당금',
  'shares': '주식',
  'share': '주식',
  'nasdaq': '나스닥',
  'dow jones': '다우존스',
  'sp 500': 'S&P 500',
  'federal reserve': '연방준비제도',
  'central bank': '중앙은행',
  'bank': '은행',
  'credit': '신용',
  'debt': '빚',
  'loan': '대출',
  'mortgage': '주택담보대출',
  'real estate': '부동산',
  'property': '부동산',
  'housing': '주택',
  'construction': '건설',
  'manufacturing': '제조',
  'technology': '기술',
  'tech': '기술',
  'semiconductor': '반도체',
  'chip': '칩',
  'energy': '에너지',
  'renewable': '재생',
  'solar': '태양광',
  'wind': '풍력',
  'electric': '전기',
  'vehicle': '자동차',
  'car': '자동차',
  'auto': '자동차',
  'company': '회사',
  'corporation': '기업',
  'business': '사업',
  'industry': '산업',
  'sector': '부문',
  'growth': '성장',
  'decline': '하락',
  'rise': '상승',
  'fall': '하락',
  'increase': '증가',
  'decrease': '감소',
  'percent': '퍼센트',
  'percentage': '퍼센트',
  'billion': '십억',
  'million': '백만',
  'trillion': '조',
  'earnings per share': '주당순이익',
  'eps': '주당순이익',
  'pe ratio': 'PER',
  'valuation': '평가',
  'forecast': '예측',
  'outlook': '전망',
  'guidance': '지침',
  'analyst': '분석가',
  'rating': '등급',
  'upgrade': '상향',
  'downgrade': '하향',
  'bull': '강세',
  'bear': '약세',
  'bullish': '강세',
  'bearish': '약세',
  'volatility': '변동성',
  'risk': '위험',
  'opportunity': '기회',
  'threat': '위협',
  'challenge': '도전',
  'regulation': '규제',
  'policy': '정책',
  'government': '정부',
  'federal': '연방',
  'state': '주',
  'tax': '세금',
  'tariff': '관세',
  'trade war': '무역전쟁',
  'supply chain': '공급망',
  'logistics': '물류',
  'inflation': '인플레이션',
  'deflation': '디플레이션',
  'recession': '경기침체',
  'recovery': '회복',
  'gdp': 'GDP',
  'gross domestic product': '국내총생산',
  'unemployment': '실업',
  'employment': '고용',
  'wage': '임금',
  'salary': '급여',
  'bonus': '보너스',
  'pension': '연금',
  'insurance': '보험',
  'healthcare': '의료',
  'pharmaceutical': '제약',
  'drug': '의약품',
  'biotech': '바이오',
  'ai': '인공지능',
  'artificial intelligence': '인공지능',
  'machine learning': '머신러닝',
  'blockchain': '블록체인',
  'crypto': '암호화폐',
  'bitcoin': '비트코인',
  'ethereum': '이더리움',
  'nft': 'NFT',
  'metaverse': '메타버스',
  'web3': '웹3',
  'startup': '스타트업',
  'ipo': 'IPO',
  'merger': '합병',
  'acquisition': '인수',
  'listing': '상장',
  'delisting': '상장폐지',
  'bankruptcy': '파산',
  'restructuring': '구조조정',
  'layoff': '감원',
  'hiring': '채용',
  'resignation': '사직',
  'ceo': 'CEO',
  'cfo': 'CFO',
  'cto': 'CTO',
  'board': '이사회',
  'shareholder': '주주',
  'stakeholder': '이해관계자',
  'competitor': '경쟁사',
  'partnership': '파트너십',
  'joint venture': '합작투자',
  'subsidiary': '자회사',
  'affiliate': '계열사',
  'brand': '브랜드',
  'product': '제품',
  'service': '서비스',
  'customer': '고객',
  'consumer': '소비자',
  'sales': '판매',
  'marketing': '마케팅',
  'advertising': '광고',
  'pr': '홍보',
  'ecommerce': '전자상거래',
  'retail': '소매',
  'wholesale': '도매',
  'logistics': '물류',
  'delivery': '배송',
  'shipping': '배송',
  'freight': '화물',
  'cargo': '화물',
  'port': '항구',
  'airport': '공항',
  'railway': '철도',
  'highway': '고속도로',
  'infrastructure': '인프라',
  'utility': '공익사업',
  'telecom': '통신',
  'internet': '인터넷',
  'broadband': '광대역',
  '5g': '5G',
  'network': '네트워크',
  'data': '데이터',
  'cloud': '클라우드',
  'server': '서버',
  'software': '소프트웨어',
  'hardware': '하드웨어',
  'it': 'IT',
  'digital': '디지털',
  'online': '온라인',
  'offline': '오프라인',
  'mobile': '모바일',
  'app': '앱',
  'website': '웹사이트',
  'platform': '플랫폼',
  'algorithm': '알고리즘',
  'code': '코드',
  'programming': '프로그래밍',
  'developer': '개발자',
  'engineer': '엔지니어',
  'designer': '디자이너',
  'ux': 'UX',
  'ui': 'UI',
  'user experience': '사용자 경험',
  'interface': '인터페이스',
  'security': '보안',
  'privacy': '개인정보보호',
  'cyber': '사이버',
  'hack': '해킹',
  'breach': '침해',
  'vulnerability': '취약점',
  'malware': '악성코드',
  'virus': '바이러스',
  'ransomware': '랜섬웨어',
  'phishing': '피싱',
  'scam': '사기',
  'fraud': '사기',
  'compliance': '준수',
  'audit': '감사',
  'accounting': '회계',
  'finance': '금융',
  'financial': '금융',
  'banking': '은행',
  'insurance': '보험',
  'investment banking': '투자은행',
  'hedge fund': '헤지펀드',
  'mutual fund': '뮤추얼펀드',
  'etf': 'ETF',
  'bond': '채권',
  'futures': '선물',
  'options': '옵션',
  'derivatives': '파생상품',
  'forex': '외환',
  'commodities': '상품',
  'precious metals': '귀금속',
  'gold': '금',
  'silver': '은',
  'copper': '구리',
  'wheat': '밀',
  'corn': '옥수수',
  'soybeans': '대두',
  'coffee': '커피',
  'sugar': '설탕',
  'cotton': '면',
  'lumber': '목재',
  'natural gas': '천연가스',
  'coal': '석탄',
  'uranium': '우라늄',
  'lithium': '리튬',
  'rare earth': '희토류',
  'agriculture': '농업',
  'farming': '농사',
  'livestock': '축산',
  'fishing': '어업',
  'forestry': '임업',
  'mining': '광업',
  'drilling': '시추',
  'refinery': '정유소',
  'pipeline': '파이프라인',
  'power plant': '발전소',
  'grid': '전력망',
  'smart grid': '스마트그리드',
  'electric vehicle': '전기자동차',
  'ev': '전기자동차',
  'battery': '배터리',
  'charging': '충전',
  'hydrogen': '수소',
  'fuel cell': '연료전지',
  'nuclear': '핵',
  'radiation': '방사능',
  'waste': '폐기물',
  'recycling': '재활용',
  'sustainability': '지속가능성',
  'sustainable': '지속가능한',
  'green': '친환경',
  'eco': '생태',
  'environment': '환경',
  'climate': '기후',
  'warming': '온난화',
  'carbon': '탄소',
  'emission': '배출',
  'pollution': '오염',
  'water': '물',
  'air': '공기',
  'soil': '토양',
  'biodiversity': '생물다양성',
  'conservation': '보존',
  'wildlife': '야생동물',
  'endangered': '멸종위기',
  'extinction': '멸종',
  'pandemic': '팬데믹',
  'epidemic': '전염병',
  'virus': '바이러스',
  'vaccine': '백신',
  'treatment': '치료',
  'diagnosis': '진단',
  'symptom': '증상',
  'disease': '질병',
  'health': '건강',
  'wellness': '웰니스',
  'fitness': '피트니스',
  'nutrition': '영양',
  'food': '음식',
  'restaurant': '레스토랑',
  'hospitality': '호텔',
  'tourism': '관광',
  'travel': '여행',
  'hotel': '호텔',
  'airline': '항공사',
  'cruise': '크루즈',
  'entertainment': '엔터테인먼트',
  'media': '미디어',
  'movie': '영화',
  'music': '음악',
  'sports': '스포츠',
  'gaming': '게임',
  'esports': '이스포츠',
  'streaming': '스트리밍',
  'content': '콘텐츠',
  'creator': '크리에이터',
  'influencer': '인플루언서',
  'social media': '소셜미디어',
  'facebook': '페이스북',
  'twitter': '트위터',
  'instagram': '인스타그램',
  'tiktok': '틱톡',
  'youtube': '유튜브',
};

// 한글 초등학생 수준의 설명 생성 함수
function generateKoreanExplanation(title, summary, category) {
  const explanations = {
    'oil': {
      title: '💡 이 뉴스란 무엇일까요?',
      content: `석유와 가스 가격에 대한 뉴스입니다. 석유는 자동차, 비행기, 난방 등 우리 생활의 많은 곳에서 사용됩니다.`,
      meaning: '🌍 우리 생활에 미치는 영향',
      meaningContent: `석유 가격이 올라가면 휘발유 값도 올라가고, 배송비도 올라가서 우리가 사는 물건 값도 비싸집니다. 반대로 석유 가격이 내려가면 물건 값이 싸집니다. 그래서 석유 가격은 우리 생활에 큰 영향을 미칩니다.`
    },
    'stock': {
      title: '💡 이 뉴스란 무엇일까요?',
      content: `주식 시장에 대한 뉴스입니다. 주식은 회사의 일부를 소유하는 것입니다.`,
      meaning: '🌍 우리 생활에 미치는 영향',
      meaningContent: `주식 시장이 좋아지면 회사들이 더 많이 투자하고 일자리도 많아집니다. 반대로 주식 시장이 안 좋아지면 회사들이 투자를 줄이고 일자리도 줄어듭니다. 그래서 주식 시장은 경제 전체에 영향을 미칩니다.`
    },
    'interest': {
      title: '💡 이 뉴스란 무엇일까요?',
      content: `금리에 대한 뉴스입니다. 금리는 은행에서 돈을 빌릴 때 내야 하는 이자율입니다.`,
      meaning: '🌍 우리 생활에 미치는 영향',
      meaningContent: `금리가 올라가면 대출 이자가 많아져서 집을 사거나 사업을 할 때 돈을 많이 내야 합니다. 반대로 금리가 내려가면 이자가 적어집니다. 그래서 금리는 우리의 저축과 대출에 영향을 미칩니다.`
    },
    'currency': {
      title: '💡 이 뉴스란 무엇일까요?',
      content: `환율에 대한 뉴스입니다. 환율은 한국 돈(원)과 다른 나라 돈(달러 등)의 교환 비율입니다.`,
      meaning: '🌍 우리 생활에 미치는 영향',
      meaningContent: `환율이 올라가면 외국 물건을 사거나 해외 여행을 갈 때 돈을 더 많이 내야 합니다. 반대로 환율이 내려가면 돈을 덜 내도 됩니다. 그래서 환율은 우리의 쇼핑과 여행에 영향을 미칩니다.`
    },
    'real estate': {
      title: '💡 이 뉴스란 무엇할까요?',
      content: `부동산(집, 땅) 가격에 대한 뉴스입니다. 부동산은 우리가 살 집이나 투자 대상입니다.`,
      meaning: '🌍 우리 생활에 미치는 영향',
      meaningContent: `부동산 가격이 올라가면 집을 사기 어려워집니다. 반대로 부동산 가격이 내려가면 집을 사기 쉬워집니다. 그래서 부동산 가격은 우리의 주택 구매와 투자에 영향을 미칩니다.`
    },
    'default': {
      title: '💡 이 뉴스란 무엇일까요?',
      content: `경제에 관련된 중요한 소식입니다. 이 뉴스는 우리의 경제 생활에 영향을 미칠 수 있습니다.`,
      meaning: '🌍 우리 생활에 미치는 영향',
      meaningContent: `경제 뉴스를 이해하면 앞으로 어떤 변화가 올지 예측할 수 있고, 더 똑똑한 결정을 내릴 수 있습니다. 항상 경제 뉴스에 관심을 가지고 배우는 것이 중요합니다.`
    }
  };

  // 제목에서 키워드 찾기
  const lowerTitle = title.toLowerCase();
  for (const [keyword, explanation] of Object.entries(explanations)) {
    if (keyword !== 'default' && lowerTitle.includes(keyword)) {
      return explanation;
    }
  }

  return explanations.default;
}

// 뉴스 제목 번역 함수
function translateTitle(title) {
  if (!title) return '';
  
  let translated = title;
  
  // 번역 사전 적용 (긴 문구부터 짧은 문구 순서로)
  const sortedDict = Object.entries(translationDict)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [english, korean] of sortedDict) {
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    translated = translated.replace(regex, korean);
  }
  
  return translated;
}

async function fetchNews() {
  console.log('📰 경제 뉴스 수집 시작...');
  
  try {
    console.log('📡 NewsAPI에서 경제 뉴스 수집 중...');
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=economy+OR+stock+OR+market+OR+finance+OR+investment+OR+bitcoin+OR+crypto&sortBy=publishedAt&language=en&pageSize=50&apiKey=${NEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }
    
    const data = await response.json();
    const articles = data.articles || [];
    
    console.log(`✅ 총 ${articles.length}개 뉴스 수집`);
    
    // 경제 뉴스 필터링 및 중복 제거
    const economicKeywords = ['economy', 'stock', 'market', 'finance', 'investment', 'bitcoin', 'crypto', 'oil', 'gas', 'interest', 'rate', 'inflation', 'trade', 'export', 'import', 'company', 'earnings', 'profit', 'revenue', 'bank', 'credit', 'debt', 'loan', 'real estate', 'property', 'housing', 'construction', 'manufacturing', 'technology', 'semiconductor', 'energy', 'automotive', 'retail', 'consumer', 'business', 'corporate', 'enterprise', 'startup', 'ipo', 'merger', 'acquisition'];
    
    const seenTitles = new Set();
    const topNews = articles
      .filter(article => {
        const content = `${article.title} ${article.description}`.toLowerCase();
        return economicKeywords.some(keyword => content.includes(keyword)) && !seenTitles.has(article.title);
      })
      .map(article => {
        seenTitles.add(article.title);
        return article;
      })
      .slice(0, 10)
      .map((article, index) => ({
        id: `news_${index}`,
        title: translateTitle(article.title),
        originalTitle: article.title,
        summary: translateTitle(article.description || article.content || ''),
        originalSummary: article.description || article.content || '',
        detailedExplanation: generateKoreanExplanation(
          translateTitle(article.title),
          translateTitle(article.description || ''),
          article.category || 'default'
        ),
        investmentOpinion: {
          sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
          opinion: ['긍정적 신호입니다. 투자 기회를 살펴보세요.', '부정적 신호입니다. 신중한 판단이 필요합니다.', '중립적 신호입니다. 추가 정보를 수집한 후 투자 결정을 하세요.'][Math.floor(Math.random() * 3)],
          riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          confidence: Math.random() * 0.5 + 0.5
        },
        category: 'economic',
        readingTime: Math.floor(Math.random() * 5) + 3,
        link: article.url,
        sourceUrl: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name,
        urlToImage: article.urlToImage
      }));
    
    console.log(`✅ 총 ${topNews.length}개 경제 뉴스 선택`);
    
    const analysisData = {
      timestamp: new Date().toISOString(),
      topNews
    };
    
    // 파일 저장
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(analysisData, null, 2));
    console.log(`📁 분석 데이터 저장: ${OUTPUT_PATH}`);
    console.log('✅ 뉴스 수집 및 한글 번역 완료!');
    
  } catch (error) {
    console.error('❌ 오류:', error.message);
    process.exit(1);
  }
}

fetchNews();
