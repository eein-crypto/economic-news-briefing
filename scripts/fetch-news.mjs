#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../client/public/data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// NewsAPI 키 (환경 변수에서 가져오기)
const NEWS_API_KEY = process.env.NEWS_API_KEY || '760f56ca65264e2b936a324982b75964';

/**
 * 초등학생 수준의 상세 설명 생성
 */
function generateDetailedExplanation(title, summary) {
  // 주제별 설명 템플릿
  const templates = {
    '환율': {
      intro: '환율이란 무엇일까요?\n환율은 한 나라의 화폐를 다른 나라의 화폐로 바꿀 때의 교환 비율을 말합니다. 예를 들어, 환율이 1,300원이라는 것은 미국 달러 1개를 사려면 한국 원화 1,300개를 줘야 한다는 의미입니다.',
      meaning: '이 뉴스의 의미\n환율이 변한다는 것은 우리 돈의 가치가 달러에 비해 올라가거나 내려간다는 뜻입니다. 환율이 올라가면 원화의 가치가 내려가고, 내려가면 원화의 가치가 올라갑니다.',
      impact: '우리 생활에 미치는 영향\n환율이 올라가면 외국 제품이 더 비싸지고, 해외 여행 비용이 늘어납니다. 하지만 한국 제품을 외국에 팔기는 더 쉬워집니다. 반대로 환율이 내려가면 외국 제품이 싸지고, 해외 여행이 저렴해집니다.'
    },
    '금리': {
      intro: '금리란 무엇일까요?\n금리는 은행에서 돈을 빌릴 때 내야 하는 이자의 비율을 말합니다. 예를 들어, 금리가 3%라면, 100만 원을 빌렸을 때 1년에 3만 원의 이자를 내야 합니다.',
      meaning: '이 뉴스의 의미\n금리가 올라간다는 것은 돈을 빌릴 때 더 많은 이자를 내야 한다는 뜻입니다. 금리가 내려가면 이자를 덜 냅니다.',
      impact: '우리 생활에 미치는 영향\n금리가 올라가면 주택 대출, 자동차 대출 등의 이자가 많아져서 생활비가 늘어납니다. 하지만 은행에 저축하면 받는 이자가 많아집니다. 반대로 금리가 내려가면 대출 이자는 줄어들지만, 저축 이자도 줄어듭니다.'
    },
    '주식': {
      intro: '주식이란 무엇일까요?\n주식은 회사의 일부를 소유하는 증서입니다. 주식을 사면 그 회사의 주인이 되는 것입니다. 회사가 잘되면 주식 가격도 올라갑니다.',
      meaning: '이 뉴스의 의미\n주식 시장이 좋아진다는 것은 많은 회사들의 실적이 좋아지고 있다는 뜻입니다. 이는 경제가 잘 돌아가고 있다는 신호입니다.',
      impact: '우리 생활에 미치는 영향\n주식 시장이 좋으면 회사들이 더 많은 사람을 고용하고, 임금도 올려줍니다. 따라서 일자리가 많아지고 경제가 활성화됩니다. 반대로 주식 시장이 나쁘면 회사들이 어려워져서 구조조정을 하고 일자리가 줄어듭니다.'
    },
    '부동산': {
      intro: '부동산이란 무엇일까요?\n부동산은 땅, 건물, 아파트 등 움직일 수 없는 재산을 말합니다. 부동산은 우리가 살아가는 데 가장 기본적인 자산입니다.',
      meaning: '이 뉴스의 의미\n부동산 가격이 올라간다는 것은 집이나 땅의 값이 비싸진다는 뜻입니다. 이는 그 지역이 발전하고 있다는 신호일 수 있습니다.',
      impact: '우리 생활에 미치는 영향\n부동산 가격이 올라가면 집을 사려는 사람들의 부담이 커집니다. 하지만 이미 집을 소유한 사람들은 자산이 늘어납니다. 부동산 가격이 내려가면 집을 사기는 쉬워지지만, 이미 집을 소유한 사람들의 자산이 줄어듭니다.'
    },
    '기업': {
      intro: '기업 뉴스란 무엇일까요?\n기업 뉴스는 회사들의 경영 상황, 신제품 출시, 투자 계획 등을 알려주는 소식입니다. 큰 기업들의 뉴스는 전체 경제에 영향을 미칩니다.',
      meaning: '이 뉴스의 의미\n기업이 새로운 투자를 한다거나 실적이 좋아진다는 것은 그 회사가 성장하고 있다는 뜻입니다.',
      impact: '우리 생활에 미치는 영향\n큰 기업들이 잘되면 그 회사에 물건을 공급하는 중소기업들도 함께 잘됩니다. 또한 회사가 새로운 사람을 고용하면서 일자리가 늘어납니다. 기업들이 새로운 기술을 개발하면 우리의 생활도 더 편해집니다.'
    },
    '에너지': {
      intro: '에너지란 무엇일까요?\n에너지는 우리가 생활하는 데 필요한 전기, 가스, 휘발유 등을 말합니다. 에너지 가격은 우리 생활비에 큰 영향을 미칩니다.',
      meaning: '이 뉴스의 의미\n유가가 올라간다는 것은 석유 가격이 비싸진다는 뜻입니다. 이는 전 세계의 경제 상황과 밀접한 관련이 있습니다.',
      impact: '우리 생활에 미치는 영향\n에너지 가격이 올라가면 휘발유, 경유, 전기료, 난방비 등이 모두 올라갑니다. 따라서 물건을 배송하는 비용이 늘어나고, 결국 우리가 사는 물건의 가격도 올라갑니다.'
    },
    '기술': {
      intro: '기술 뉴스란 무엇일까요?\n기술 뉴스는 새로운 제품, 반도체, AI, 인터넷 등 첨단 기술에 관한 소식입니다. 새로운 기술은 우리의 생활을 변화시킵니다.',
      meaning: '이 뉴스의 의미\n새로운 기술이 개발된다는 것은 미래가 변할 수 있다는 뜻입니다. 기술 발전은 새로운 산업과 일자리를 만듭니다.',
      impact: '우리 생활에 미치는 영향\n새로운 기술은 우리의 일상을 더 편하게 만듭니다. 또한 기술 회사들이 성장하면서 경제가 활성화됩니다. 새로운 기술을 배우는 사람들의 가치도 올라갑니다.'
    }
  };

  // 제목에서 주제 찾기
  const titleLower = title.toLowerCase();
  for (const [keyword, template] of Object.entries(templates)) {
    if (titleLower.includes(keyword)) {
      return `${template.intro}\n\n${template.meaning}\n\n${template.impact}`;
    }
  }

  // 기본 설명
  return `이 뉴스란 무엇일까요?\n${summary}\n\n우리 생활에 미치는 영향\n이 뉴스는 우리의 경제 생활에 영향을 미치는 중요한 소식입니다. 경제 뉴스를 이해하면 앞으로 어떤 변화가 올지 예측할 수 있습니다.`;
}

/**
 * 투자 의견 생성
 */
function generateInvestmentOpinion(title, summary) {
  const titleLower = title.toLowerCase();
  const summaryLower = summary.toLowerCase();
  const text = titleLower + ' ' + summaryLower;
  
  // 긍정적 신호
  if (text.includes('상승') || text.includes('급등') || text.includes('호조') || 
      text.includes('증가') || text.includes('강세') || text.includes('최고') ||
      text.includes('개선') || text.includes('성장') || text.includes('회복')) {
    return {
      sentiment: 'positive',
      opinion: '긍정적 신호입니다. 이 분야에 투자하는 것을 고려해볼 수 있습니다.',
      riskLevel: 'low',
      confidence: 0.85
    };
  } 
  // 부정적 신호
  else if (text.includes('하락') || text.includes('급락') || text.includes('부진') || 
           text.includes('감소') || text.includes('약세') || text.includes('최저') ||
           text.includes('악화') || text.includes('위기') || text.includes('침체')) {
    return {
      sentiment: 'negative',
      opinion: '부정적 신호입니다. 신중한 투자 결정이 필요합니다.',
      riskLevel: 'high',
      confidence: 0.80
    };
  } 
  // 중립적 신호
  else {
    return {
      sentiment: 'neutral',
      opinion: '중립적 신호입니다. 추가 정보를 수집한 후 투자 결정을 하세요.',
      riskLevel: 'medium',
      confidence: 0.75
    };
  }
}

/**
 * NewsAPI에서 뉴스 수집
 */
async function fetchFromNewsAPI() {
  try {
    console.log('📡 NewsAPI에서 경제 뉴스 수집 중...');
    
    // 경제 관련 검색어
    const queries = ['economy', 'stock market', 'finance', 'cryptocurrency', 'real estate'];
    let allNews = [];
    
    for (const query of queries) {
      const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.articles) {
          allNews = allNews.concat(data.articles);
        }
      } catch (error) {
        console.error(`❌ 쿼리 '${query}' 수집 실패:`, error.message);
      }
    }
    
    console.log(`✅ 총 ${allNews.length}개 뉴스 수집`);
    return allNews;
  } catch (error) {
    console.error('❌ NewsAPI 오류:', error.message);
    return [];
  }
}

/**
 * 메인 함수
 */
async function main() {
  try {
    console.log('📰 경제 뉴스 수집 시작...');
    
    // NewsAPI에서 뉴스 수집
    const articles = await fetchFromNewsAPI();
    
    if (articles.length === 0) {
      console.log('⚠️ 뉴스를 수집할 수 없습니다. 샘플 데이터를 사용합니다.');
      process.exit(0);
    }
    
    // 중복 제거
    const uniqueNews = [];
    const seenTitles = new Set();
    
    for (const article of articles) {
      if (!seenTitles.has(article.title) && article.title && article.description) {
        seenTitles.add(article.title);
        uniqueNews.push(article);
      }
    }
    
    // 최신순 정렬 후 상위 10개
    const topNews = uniqueNews.slice(0, 10);
    
    console.log(`✅ 총 ${topNews.length}개 경제 뉴스 선택`);
    
    // 뉴스에 상세 설명과 투자 의견 추가
    const newsWithAnalysis = topNews.map((article, idx) => ({
      id: `news_${idx}`,
      title: article.title,
      summary: article.description || article.content || '',
      detailedExplanation: generateDetailedExplanation(article.title, article.description || ''),
      investmentOpinion: generateInvestmentOpinion(article.title, article.description || ''),
      category: 'economic',
      readingTime: 5,
      link: article.url,
      sourceUrl: article.url,
      publishedAt: article.publishedAt,
      source: article.source.name,
      urlToImage: article.urlToImage
    }));
    
    // 분석 데이터 생성
    const analysis = {
      timestamp: new Date().toISOString(),
      topNews: newsWithAnalysis,
      lastUpdated: new Date().toLocaleString('ko-KR'),
      insights: {
        topCategories: [
          {
            category: '경제',
            count: newsWithAnalysis.length,
            topNews: newsWithAnalysis[0]?.title || '',
            avgImportance: 80
          }
        ],
        recommendation: '다양한 경제 뉴스를 읽으며 경제 감각을 키워보세요!',
        riskLevel: '중간',
        sectors: [
          {
            name: '금융',
            outlook: '중립',
            reason: '경제 상황에 따라 변동'
          },
          {
            name: '기술',
            outlook: '긍정적',
            reason: '지속적인 혁신'
          },
          {
            name: '에너지',
            outlook: '중립',
            reason: '국제 정세에 따라 변동'
          },
          {
            name: '부동산',
            outlook: '중립',
            reason: '금리와 수급에 따라 변동'
          },
          {
            name: '기업',
            outlook: '긍정적',
            reason: '경제 성장에 따라 개선'
          }
        ]
      },
      investmentReport: {
        marketSentiment: 'neutral',
        topRecommendations: newsWithAnalysis
          .filter(n => n.investmentOpinion.sentiment === 'positive')
          .slice(0, 3)
          .map(n => ({
            title: n.title,
            opinion: n.investmentOpinion.opinion,
            riskLevel: n.investmentOpinion.riskLevel
          })),
        warnings: newsWithAnalysis
          .filter(n => n.investmentOpinion.sentiment === 'negative')
          .slice(0, 3)
          .map(n => ({
            title: n.title,
            opinion: n.investmentOpinion.opinion,
            riskLevel: n.investmentOpinion.riskLevel
          }))
      },
      news: newsWithAnalysis
    };
    
    // 파일 저장
    const outputPath = path.join(dataDir, 'analysis.json');
    fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
    
    console.log(`📁 분석 데이터 저장: ${outputPath}`);
    console.log('✅ 뉴스 수집 및 분석 완료!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

main();
