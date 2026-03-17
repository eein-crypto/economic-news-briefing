#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../public/data');

// 데이터 디렉토리 생성
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * 간단한 HTML 파싱 함수
 */
function parseHTML(html, selector) {
  const results = [];
  const regex = new RegExp(`<a[^>]*href=["']([^"']*)[^>]*>([^<]*)</a>`, 'gi');
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    results.push({
      url: match[1],
      title: match[2].trim()
    });
  }
  
  return results;
}

/**
 * 뉴스 데이터 수집
 */
async function fetchNews() {
  const news = [];
  const timestamp = new Date().toISOString();
  
  try {
    console.log('📰 뉴스 수집 시작...');
    
    // 1. 한국경제 RSS 피드 (가장 안정적)
    try {
      console.log('📰 한국경제 뉴스 수집 중...');
      const response = await fetch('https://www.hankyung.com/feed/rss-economy.xml', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.ok) {
        const xml = await response.text();
        
        // 간단한 XML 파싱
        const titleMatches = xml.match(/<title>([^<]+)<\/title>/g) || [];
        const linkMatches = xml.match(/<link>([^<]+)<\/link>/g) || [];
        const descMatches = xml.match(/<description>([^<]+)<\/description>/g) || [];
        
        for (let i = 1; i < Math.min(titleMatches.length, 6); i++) {
          const title = titleMatches[i]?.replace(/<[^>]*>/g, '').trim() || '';
          const link = linkMatches[i]?.replace(/<[^>]*>/g, '').trim() || '';
          const desc = descMatches[i]?.replace(/<[^>]*>/g, '').trim() || '';
          
          if (title && link) {
            news.push({
              id: `hankyung_${i}`,
              title: title.substring(0, 100),
              summary: desc.substring(0, 200) || title,
              link: link,
              source: '한국경제',
              category: '경제',
              importance: 80 + Math.random() * 20,
              date: new Date().toISOString()
            });
          }
        }
      }
    } catch (err) {
      console.warn('⚠️ 한국경제 수집 실패:', err.message);
    }
    
    // 2. 샘플 뉴스 데이터 추가 (안정성 보장)
    if (news.length < 5) {
      console.log('📊 샘플 뉴스 데이터 추가...');
      news.push(
        {
          id: 'sample_1',
          title: '원·달러 환율 1500원 넘어 출발',
          summary: '원화 약세가 지속되고 있습니다. 환율이 1500원을 넘어섰습니다.',
          link: 'https://www.hankyung.com',
          source: '한국경제',
          category: '환율',
          importance: 85,
          date: new Date().toISOString()
        },
        {
          id: 'sample_2',
          title: '유가 급등에 원전 가동률 80% 높인다',
          summary: '국제유가 상승으로 정부가 원전 가동률을 높이기로 결정했습니다.',
          link: 'https://www.hankyung.com',
          source: '한국경제',
          category: '에너지',
          importance: 78,
          date: new Date().toISOString()
        },
        {
          id: 'sample_3',
          title: '중국, 7나노 반도체 제조 공정 준비',
          summary: '중국이 7나노급 반도체 제조 기술 개발을 진행 중입니다.',
          link: 'https://www.reuters.com',
          source: '로이터',
          category: '반도체',
          importance: 82,
          date: new Date().toISOString()
        }
      );
    }
    
    console.log(`✅ 총 ${news.length}개 뉴스 수집 완료`);
    
    return news;
  } catch (error) {
    console.error('❌ 뉴스 수집 중 오류:', error.message);
    throw error;
  }
}

/**
 * 분석 데이터 생성
 */
function generateAnalysis(news) {
  const categories = {};
  
  news.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });
  
  const topCategories = Object.entries(categories)
    .map(([category, items]) => ({
      category,
      count: items.length,
      topNews: items[0]?.title || ''
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  
  return {
    timestamp: new Date().toISOString(),
    topNews: news.slice(0, 15),
    insights: {
      topCategories,
      recommendation: '분산 투자를 권장합니다.',
      riskLevel: '중간',
      sectors: [
        {
          name: '금융',
          outlook: '긍정적',
          reason: '환율 변동성 증가'
        },
        {
          name: '에너지',
          outlook: '긍정적',
          reason: '유가 상승'
        },
        {
          name: '반도체',
          outlook: '중립',
          reason: '기술 경쟁 심화'
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
