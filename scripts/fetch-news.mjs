#!/usr/bin/env node

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import xml2js from 'xml2js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../public/data');

// 디렉토리 생성
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * 네이버 뉴스 크롤링 - 경제 섹션
 */
async function fetchNaverNews() {
  try {
    console.log('📰 네이버 뉴스 크롤링 시작...');
    
    const url = 'https://news.naver.com/section/101'; // 경제 섹션
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const news = [];
    
    // 뉴스 항목 추출
    $('ul.type06_headline_articlelist li').slice(0, 10).each((idx, elem) => {
      const titleElem = $(elem).find('a.nclicks');
      const title = titleElem.attr('title') || titleElem.text().trim();
      const link = titleElem.attr('href');
      const source = $(elem).find('span.writing').text().trim();
      const date = $(elem).find('span.date').text().trim();
      
      if (title && link) {
        news.push({
          id: `naver_${idx}_${Date.now()}`,
          title,
          link: link.startsWith('http') ? link : `https://news.naver.com${link}`,
          source: source || '네이버뉴스',
          date: date || new Date().toISOString(),
          type: 'economic',
          platform: 'naver'
        });
      }
    });
    
    console.log(`✅ 네이버에서 ${news.length}개 뉴스 수집`);
    return news;
  } catch (error) {
    console.error('❌ 네이버 뉴스 크롤링 실패:', error.message);
    return [];
  }
}

/**
 * 다음 뉴스 크롤링 - 경제 섹션
 */
async function fetchDaumNews() {
  try {
    console.log('📰 다음 뉴스 크롤링 시작...');
    
    const url = 'https://news.daum.net/economic';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const news = [];
    
    // 뉴스 항목 추출
    $('div.item-article').slice(0, 10).each((idx, elem) => {
      const titleElem = $(elem).find('a.link-title');
      const title = titleElem.text().trim();
      const link = titleElem.attr('href');
      const source = $(elem).find('span.info-news').text().trim();
      
      if (title && link) {
        news.push({
          id: `daum_${idx}_${Date.now()}`,
          title,
          link: link.startsWith('http') ? link : `https://news.daum.net${link}`,
          source: source || '다음뉴스',
          date: new Date().toISOString(),
          type: 'economic',
          platform: 'daum'
        });
      }
    });
    
    console.log(`✅ 다음에서 ${news.length}개 뉴스 수집`);
    return news;
  } catch (error) {
    console.error('❌ 다음 뉴스 크롤링 실패:', error.message);
    return [];
  }
}

/**
 * RSS 피드 파싱 (한국경제, 로이터 등)
 */
async function fetchRSSFeed(feedUrl, feedName) {
  try {
    console.log(`📰 ${feedName} RSS 피드 수집 중...`);
    
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    if (!response.ok) {
      console.warn(`Failed to fetch ${feedName}: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);

    // RSS 또는 Atom 형식 처리
    const items = result.rss?.channel?.[0]?.item || result.feed?.entry || [];

    const news = items.slice(0, 10).map((item, index) => ({
      id: `${feedName}_${index}_${Date.now()}`,
      title: item.title?.[0] || 'No title',
      link: item.link?.[0]?.$ ? item.link[0].$.href : item.link?.[0] || '#',
      source: feedName,
      date: item.pubDate?.[0] || item.published?.[0] || new Date().toISOString(),
      type: 'economic',
      platform: feedName.toLowerCase()
    }));

    console.log(`✅ ${feedName}에서 ${news.length}개 뉴스 수집`);
    return news;
  } catch (error) {
    console.error(`❌ ${feedName} RSS 피드 수집 실패:`, error.message);
    return [];
  }
}

/**
 * 중복 제거
 */
function removeDuplicates(newsArray) {
  const seen = new Set();
  return newsArray.filter(news => {
    const key = news.title.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * 뉴스 우선순위 정렬 (키워드 기반)
 */
function prioritizeNews(newsArray) {
  const importantKeywords = [
    '금리', '인상', '인하', '기준금리',
    '주가', '코스피', '코스닥', '상승', '하락',
    '환율', '원달러', '환율인상',
    '부동산', '집값', '전세', '월세',
    '실업', '취업', '고용', '채용',
    '인플레이션', '물가', '가격',
    'GDP', '경제성장', '경제',
    '기업', '실적', '배당', '주식',
    '암호화폐', '비트코인', '이더리움',
    '정책', '규제', '개혁', '법안',
    '수출', '수입', '무역',
    '소비', '소비자',
    '은행', '금융'
  ];
  
  return newsArray.sort((a, b) => {
    const aScore = importantKeywords.filter(kw => 
      a.title.toLowerCase().includes(kw.toLowerCase())
    ).length;
    
    const bScore = importantKeywords.filter(kw => 
      b.title.toLowerCase().includes(kw.toLowerCase())
    ).length;
    
    return bScore - aScore;
  });
}

/**
 * 투자 리포트 생성
 */
function generateInvestmentReport(news) {
  const topNews = news.slice(0, 3);
  const keywords = [];
  
  topNews.forEach(item => {
    if (item.title.includes('금리')) keywords.push('금리 변화');
    if (item.title.includes('주가')) keywords.push('주가 동향');
    if (item.title.includes('환율')) keywords.push('환율 변동');
    if (item.title.includes('부동산')) keywords.push('부동산 시장');
    if (item.title.includes('기업')) keywords.push('기업 실적');
  });

  return {
    title: '오늘의 투자 관점',
    analysis: `오늘의 경제 뉴스를 종합하면, ${keywords.slice(0, 2).join(', ')} 등이 시장에 영향을 미치고 있습니다.`,
    outlook: '앞으로의 투자 방향을 결정할 때는 이러한 경제 뉴스들을 참고하시기 바랍니다.',
    strategy: '다양한 섹터에 분산 투자하는 것이 현명한 투자 전략입니다.',
    sectors: [
      { name: 'IT/기술', outlook: '긍정적', reason: '디지털 전환 가속화' },
      { name: '금융', outlook: '중립', reason: '금리 정책 영향' },
      { name: '에너지', outlook: '중립', reason: '국제 유가 변동' }
    ]
  };
}

/**
 * 메인 함수
 */
async function main() {
  try {
    console.log('🚀 경제 뉴스 수집 시작...\n');
    
    // 모든 소스에서 뉴스 수집
    const [naverNews, daumNews, hankyungNews] = await Promise.all([
      fetchNaverNews(),
      fetchDaumNews(),
      fetchRSSFeed('https://feeds.hankyung.com/feed/economy', '한국경제')
    ]);
    
    // 모든 뉴스 합치기
    let allNews = [...naverNews, ...daumNews, ...hankyungNews];
    
    // 중복 제거
    allNews = removeDuplicates(allNews);
    
    // 우선순위 정렬
    allNews = prioritizeNews(allNews);
    
    // 상위 15개만 선택
    const topNews = allNews.slice(0, 15);
    
    // 투자 리포트 생성
    const investmentReport = generateInvestmentReport(topNews);
    
    // 데이터 저장
    const outputPath = path.join(DATA_DIR, 'news.json');
    fs.writeFileSync(outputPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      total: topNews.length,
      news: topNews,
      investmentReport
    }, null, 2));
    
    console.log(`\n✅ 뉴스 수집 완료!`);
    console.log(`📊 총 ${topNews.length}개 뉴스 저장됨`);
    console.log(`📁 저장 위치: ${outputPath}`);
    
    // 상위 5개 뉴스 표시
    console.log('\n🔝 상위 뉴스:');
    topNews.slice(0, 5).forEach((news, idx) => {
      console.log(`${idx + 1}. [${news.platform.toUpperCase()}] ${news.title}`);
    });
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

main();
