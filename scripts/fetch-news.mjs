#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../client/public/data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * 경제 뉴스 필터링 - 경제와 관련 없는 뉴스 제외
 */
function isEconomicNews(title, summary) {
  const economicKeywords = [
    '경제', '금리', '환율', '주식', '코스피', '코스닥', '부동산', '아파트', '주택',
    '기업', '삼성', 'SK', 'LG', '현대', '기아', '투자', '수익', '실적', '배당',
    '은행', '보험', '금융', '증권', '펀드', '채권', '유가', '유류', '에너지',
    '반도체', '배터리', '전기차', '자동차', '조선', '철강', '화학', '제약',
    '통신', '인터넷', '게임', '콘텐츠', '물류', '유통', '소매', '식품',
    '관광', '호텔', '항공', '해운', '철도', '도로', '건설', '부동산',
    '정책', '규제', '세금', '관세', '수출', '수입', '무역', '환경',
    '고용', '실업', '임금', '근로', '노동', '복지', '연금', '보험',
    '부채', '적자', '흑자', '성장', '침체', '회복', '위기', '호황',
    '시장', '산업', '섹터', '트렌드', '전망', '예측', '분석', '리포트'
  ];

  const text = (title + ' ' + summary).toLowerCase();
  const isEconomic = economicKeywords.some(keyword => text.includes(keyword));
  
  // 연예, 스포츠, 정치 등 제외
  const excludeKeywords = ['연예', '배우', '가수', '영화', '드라마', '스포츠', '축구', '야구', '농구', '정치', '대선', '총선', '의원', '당', '범죄', '사건', '사고'];
  const isExcluded = excludeKeywords.some(keyword => text.includes(keyword));
  
  return isEconomic && !isExcluded;
}

/**
 * 공개 RSS 피드에서 뉴스 수집
 */
async function fetchFromRSS(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) return [];
    
    const text = await response.text();
    const items = [];
    
    // RSS item 파싱
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(text)) !== null) {
      const itemContent = match[1];
      
      const titleMatch = /<title[^>]*>([^<]+)<\/title>/.exec(itemContent);
      const descMatch = /<description[^>]*>([^<]*)<\/description>/.exec(itemContent);
      const linkMatch = /<link[^>]*>([^<]+)<\/link>/.exec(itemContent);
      const pubDateMatch = /<pubDate[^>]*>([^<]+)<\/pubDate>/.exec(itemContent);
      
      const title = titleMatch ? titleMatch[1].replace(/&[^;]+;/g, '').trim() : '';
      const description = descMatch ? descMatch[1].replace(/&[^;]+;/g, '').replace(/<[^>]+>/g, '').trim() : '';
      const link = linkMatch ? linkMatch[1].trim() : '';
      const pubDate = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();
      
      if (title && description && isEconomicNews(title, description)) {
        items.push({
          title: title.substring(0, 100),
          summary: description.substring(0, 200),
          link: link || '#',
          pubDate,
          source: new URL(url).hostname
        });
      }
    }
    
    return items;
  } catch (error) {
    console.error(`❌ RSS 파싱 오류 (${url}):`, error.message);
    return [];
  }
}

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
  
  if (titleLower.includes('상승') || titleLower.includes('급등') || titleLower.includes('호조')) {
    return {
      sentiment: 'positive',
      opinion: '긍정적 신호입니다. 이 분야에 투자하는 것을 고려해볼 수 있습니다.',
      riskLevel: 'medium'
    };
  } else if (titleLower.includes('하락') || titleLower.includes('급락') || titleLower.includes('부진')) {
    return {
      sentiment: 'negative',
      opinion: '부정적 신호입니다. 신중한 투자 결정이 필요합니다.',
      riskLevel: 'high'
    };
  } else {
    return {
      sentiment: 'neutral',
      opinion: '중립적 신호입니다. 추가 정보를 수집한 후 투자 결정을 하세요.',
      riskLevel: 'medium'
    };
  }
}

/**
 * 메인 함수
 */
async function main() {
  try {
    console.log('📰 경제 뉴스 수집 시작...');
    
    const rssFeeds = [
      'https://feeds.bloomberg.com/markets/news.rss',
      'https://feeds.reuters.com/reuters/businessNews',
      'https://feeds.cnbc.com/id/100003114/rss.html',
      'https://feeds.finance.naver.com/news/mainnews.xml'
    ];
    
    let allNews = [];
    
    for (const feed of rssFeeds) {
      console.log(`🔍 ${feed}에서 뉴스 수집 중...`);
      const news = await fetchFromRSS(feed);
      allNews = allNews.concat(news);
    }
    
    // 중복 제거
    const uniqueNews = [];
    const seenTitles = new Set();
    
    for (const item of allNews) {
      if (!seenTitles.has(item.title)) {
        seenTitles.add(item.title);
        uniqueNews.push(item);
      }
    }
    
    // 최신순 정렬 후 상위 10개
    const topNews = uniqueNews
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
      .slice(0, 10);
    
    console.log(`✅ 총 ${topNews.length}개 경제 뉴스 수집 완료`);
    
    // 뉴스에 상세 설명과 투자 의견 추가
    const newsWithAnalysis = topNews.map((item, idx) => ({
      id: `news_${idx}`,
      title: item.title,
      summary: item.summary,
      detailedExplanation: generateDetailedExplanation(item.title, item.summary),
      investmentOpinion: generateInvestmentOpinion(item.title, item.summary),
      category: 'economic',
      readingTime: 5,
      link: item.link,
      sourceUrl: item.link,
      publishedAt: item.pubDate,
      source: item.source
    }));
    
    // 분석 데이터 생성
    const analysis = {
      timestamp: new Date().toISOString(),
      topNews: newsWithAnalysis,
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
      }
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
