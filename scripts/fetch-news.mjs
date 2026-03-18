#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../client/public/data');

// 데이터 디렉토리 생성
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * RSS 피드 파싱
 */
async function parseRSSFeed(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // 간단한 XML 파싱 (정규식 사용)
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const items = [];
    let match;
    
    while ((match = itemRegex.exec(text)) !== null) {
      const itemContent = match[1];
      
      // 제목 추출
      const titleMatch = /<title[^>]*>([^<]+)<\/title>/.exec(itemContent);
      const title = titleMatch ? titleMatch[1].trim() : '';
      
      // 설명 추출
      const descMatch = /<description[^>]*>([^<]+)<\/description>/.exec(itemContent);
      const description = descMatch ? descMatch[1].trim() : '';
      
      // 링크 추출
      const linkMatch = /<link[^>]*>([^<]+)<\/link>/.exec(itemContent);
      const link = linkMatch ? linkMatch[1].trim() : '';
      
      // pubDate 추출
      const pubDateMatch = /<pubDate[^>]*>([^<]+)<\/pubDate>/.exec(itemContent);
      const pubDate = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();
      
      if (title && description) {
        items.push({
          title,
          summary: description,
          link,
          pubDate
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
 * 뉴스 데이터 수집
 */
async function fetchNews() {
  const news = [];
  
  try {
    console.log('📰 뉴스 수집 시작...');
    
    // 1. 네이버 뉴스 RSS
    console.log('🔍 네이버 경제 뉴스 수집 중...');
    const naverUrls = [
      'https://rss.finance.naver.com/news.xml?mode=LSS&section_id=101', // 금융 뉴스
      'https://rss.finance.naver.com/news.xml?mode=LSS&section_id=100' // 경제 뉴스
    ];
    
    for (const url of naverUrls) {
      const items = await parseRSSFeed(url);
      news.push(...items);
    }
    
    // 2. 구글 뉴스 RSS (경제 뉴스)
    console.log('🔍 구글 경제 뉴스 수집 중...');
    const googleUrls = [
      'https://news.google.com/rss/search?q=한국%20경제&hl=ko&gl=KR&ceid=KR:ko', // 한국 경제
      'https://news.google.com/rss/search?q=주식%20시장&hl=ko&gl=KR&ceid=KR:ko' // 주식 시장
    ];
    
    for (const url of googleUrls) {
      const items = await parseRSSFeed(url);
      news.push(...items);
    }
    
    // 중복 제거 (제목 기준)
    const uniqueNews = [];
    const seenTitles = new Set();
    
    for (const item of news) {
      if (!seenTitles.has(item.title)) {
        seenTitles.add(item.title);
        uniqueNews.push(item);
      }
    }
    
    // 최대 10개만 유지
    const finalNews = uniqueNews.slice(0, 10);
    
    console.log(`✅ 총 ${finalNews.length}개 뉴스 수집 완료`);
    
    return finalNews;
  } catch (error) {
    console.error('❌ 뉴스 수집 중 오류:', error.message);
    throw error;
  }
}

/**
 * AI 스타일 상세 설명 생성 (초등학생 수준)
 */
function generateDetailedExplanation(title, summary) {
  // 주제별 설명 템플릿
  const templates = {
    '환율': `환율이란 무엇일까요?\n환율은 한 나라의 화폐를 다른 나라의 화폐로 바꿀 때의 교환 비율을 말합니다.\n\n${title}의 의미\n${summary}\n\n우리 생활에 미치는 영향\n환율이 변하면 외국 제품 가격, 해외 여행 비용, 한국 제품의 수출 경쟁력 등이 영향을 받습니다.`,
    
    '금리': `금리란 무엇일까요?\n금리는 은행에서 돈을 빌릴 때 내야 하는 이자의 비율을 말합니다.\n\n${title}의 의미\n${summary}\n\n우리 생활에 미치는 영향\n금리가 올라가면 대출 이자가 많아지고, 내려가면 이자가 적어집니다. 따라서 주택 구입, 자동차 구입 등에 직접 영향을 미칩니다.`,
    
    '주식': `주식이란 무엇일까요?\n주식은 회사의 일부를 소유하는 증서입니다. 주식을 사면 그 회사의 주인이 되는 것입니다.\n\n${title}의 의미\n${summary}\n\n우리 생활에 미치는 영향\n주식 시장이 좋아지면 경제가 활성화되고, 회사들이 더 많은 사람을 고용합니다.`,
    
    '부동산': `부동산이란 무엇일까요?\n부동산은 땅, 건물 등 움직일 수 없는 재산을 말합니다.\n\n${title}의 의미\n${summary}\n\n우리 생활에 미치는 영향\n부동산 가격이 올라가면 집을 사려는 사람들의 부담이 커집니다.`,
    
    '기업': `기업 뉴스란 무엇일까요?\n기업 뉴스는 회사들의 경영 상황, 신제품 출시, 투자 계획 등을 알려주는 소식입니다.\n\n${title}의 의미\n${summary}\n\n우리 생활에 미치는 영향\n큰 기업들의 투자와 고용 계획은 우리 경제 전체에 영향을 미칩니다.`,
    
    '에너지': `에너지란 무엇일까요?\n에너지는 우리가 생활하는 데 필요한 전기, 가스, 휘발유 등을 말합니다.\n\n${title}의 의미\n${summary}\n\n우리 생활에 미치는 영향\n에너지 가격이 올라가면 전기료, 난방비, 휘발유 가격 등이 모두 올라갑니다.`,
    
    '기술': `기술 뉴스란 무엇일까요?\n기술 뉴스는 새로운 제품, 반도체, AI 등 첨단 기술에 관한 소식입니다.\n\n${title}의 의미\n${summary}\n\n우리 생활에 미치는 영향\n새로운 기술은 우리의 일상을 더 편하게 만들고, 새로운 일자리를 만듭니다.`
  };
  
  // 제목에서 주제 찾기
  for (const [keyword, template] of Object.entries(templates)) {
    if (title.includes(keyword) || summary.includes(keyword)) {
      return template;
    }
  }
  
  // 기본 설명
  return `이 뉴스란 무엇일까요?\n${summary}\n\n우리 생활에 미치는 영향\n이 뉴스는 우리의 일상 경제에 영향을 미치는 중요한 소식입니다. 경제 뉴스를 이해하면 앞으로 어떤 변화가 올지 예측할 수 있습니다.`;
}

/**
 * 분석 데이터 생성
 */
function generateAnalysis(news) {
  // 뉴스에 상세 설명 추가
  const newsWithExplanations = news.map((item, idx) => ({
    id: `news_${idx}`,
    title: item.title,
    summary: item.summary,
    detailedExplanation: generateDetailedExplanation(item.title, item.summary),
    category: 'domestic',
    readingTime: 5,
    link: item.link,
    sourceUrl: item.link,
    publishedAt: item.pubDate,
    source: '네이버/구글 뉴스'
  }));
  
  return {
    timestamp: new Date().toISOString(),
    topNews: newsWithExplanations,
    insights: {
      topCategories: [
        {
          category: '경제',
          count: newsWithExplanations.length,
          topNews: newsWithExplanations[0]?.title || '',
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
}

/**
 * 메인 함수
 */
async function main() {
  try {
    // 뉴스 수집
    const news = await fetchNews();
    
    if (news.length === 0) {
      console.warn('⚠️ 수집된 뉴스가 없습니다. 테스트 데이터를 사용합니다.');
      // 테스트 데이터 사용
      news.push({
        title: '경제 뉴스를 수집 중입니다',
        summary: '실시간 경제 뉴스 수집이 진행 중입니다. 잠시 후 다시 시도해주세요.',
        link: '#',
        pubDate: new Date().toISOString()
      });
    }
    
    // 분석 데이터 생성
    const analysis = generateAnalysis(news);
    
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
