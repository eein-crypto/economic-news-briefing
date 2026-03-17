#!/usr/bin/env node

import fetch from 'node-fetch';
import xml2js from 'xml2js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// RSS 피드 목록
const RSS_FEEDS = [
  {
    name: '한국경제',
    url: 'https://feeds.hankyung.com/feed/economy',
    category: '국내'
  },
  {
    name: '네이버 뉴스',
    url: 'https://news.naver.com/rss/economy.xml',
    category: '국내'
  },
  {
    name: '다음 뉴스',
    url: 'https://feeds.daum.net/economy',
    category: '국내'
  },
  {
    name: '로이터',
    url: 'https://feeds.reuters.com/reuters/businessNews',
    category: '해외'
  }
];

// AI 요약 함수 (간단한 버전 - 실제로는 더 복잡한 로직 필요)
function generateSimpleSummary(content, title) {
  if (!content) return `${title}에 대한 뉴스입니다.`;
  
  // 첫 번째 문장들을 추출
  const sentences = content
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 10)
    .slice(0, 3)
    .map(s => s.trim() + '.');
  
  return sentences.join(' ') || `${title}에 대한 경제 뉴스입니다.`;
}

// RSS 피드 파싱
async function fetchRSSFeed(feedUrl) {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    if (!response.ok) {
      console.warn(`Failed to fetch ${feedUrl}: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);

    // RSS 또는 Atom 형식 처리
    const items = result.rss?.channel?.[0]?.item || result.feed?.entry || [];

    return items.slice(0, 5).map((item, index) => ({
      id: `${Date.now()}-${index}`,
      title: item.title?.[0] || 'No title',
      link: item.link?.[0]?.$ ? item.link[0].$.href : item.link?.[0] || '#',
      description: item.description?.[0] || item.summary?.[0] || '',
      pubDate: item.pubDate?.[0] || item.published?.[0] || new Date().toISOString(),
      source: item.source?.[0]?.title?.[0] || 'Unknown'
    }));
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, error.message);
    return [];
  }
}

// 웹 크롤링으로 기사 본문 추출 (간단한 버전)
async function fetchArticleContent(url) {
  try {
    if (!url || url === '#') return '';
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 8000
    });

    if (!response.ok) return '';

    const html = await response.text();
    
    // 간단한 텍스트 추출 (실제로는 더 정교한 파싱 필요)
    const textMatch = html.match(/<article[^>]*>[\s\S]*?<\/article>/i) ||
                      html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>[\s\S]*?<\/div>/i) ||
                      html.match(/<body[^>]*>[\s\S]*?<\/body>/i);
    
    if (textMatch) {
      const text = textMatch[0]
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return text.substring(0, 500);
    }

    return '';
  } catch (error) {
    console.warn(`Error fetching article content from ${url}:`, error.message);
    return '';
  }
}

// 모든 뉴스 수집
async function fetchAllNews() {
  console.log('🔄 뉴스 수집 시작...');
  
  const allNews = [];

  for (const feed of RSS_FEEDS) {
    console.log(`📰 ${feed.name}에서 뉴스 수집 중...`);
    const items = await fetchRSSFeed(feed.url);
    
    for (const item of items) {
      // 웹 크롤링으로 본문 추출
      const content = await fetchArticleContent(item.link);
      
      const newsItem = {
        id: item.id,
        title: item.title,
        category: feed.category,
        source: feed.name,
        link: item.link,
        summary: generateSimpleSummary(content || item.description, item.title),
        fullDescription: content || item.description,
        publishedAt: new Date(item.pubDate).toISOString(),
        readingTime: Math.max(2, Math.ceil((content || item.description).length / 300))
      };
      
      allNews.push(newsItem);
    }
    
    // API 요청 제한을 피하기 위해 대기
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return allNews;
}

// 뉴스 데이터 저장
async function saveNewsData(news) {
  const outputDir = path.join(__dirname, '../public/data');
  
  // 디렉토리 생성
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const data = {
    news: news.slice(0, 10), // 상위 10개만 저장
    investmentReport: {
      title: '오늘의 투자 관점',
      analysis: '오늘의 경제 뉴스를 종합하면, 국내외 주요 경제 지표들이 시장에 영향을 미치고 있습니다.',
      outlook: '앞으로의 투자 방향을 결정할 때는 이러한 경제 뉴스들을 참고하시기 바랍니다.',
      strategy: '다양한 섹터에 분산 투자하는 것이 현명한 투자 전략입니다.',
      sectors: [
        { name: 'IT/기술', outlook: '긍정적', reason: '디지털 전환 가속화' },
        { name: '금융', outlook: '중립', reason: '금리 정책 영향' },
        { name: '에너지', outlook: '부정적', reason: '유가 변동성' }
      ]
    },
    lastUpdated: new Date().toISOString()
  };

  const outputPath = path.join(outputDir, 'news.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
  
  console.log(`✅ 뉴스 데이터 저장 완료: ${outputPath}`);
  console.log(`📊 수집된 뉴스: ${news.length}개`);
}

// 메인 함수
async function main() {
  try {
    const news = await fetchAllNews();
    await saveNewsData(news);
    console.log('✨ 뉴스 수집 완료!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

main();
