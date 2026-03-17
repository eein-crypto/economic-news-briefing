#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../public/data');

/**
 * 뉴스 중요도 점수 계산
 */
function calculateImportanceScore(title) {
  let score = 0;

  // 1. 키워드 기반 점수
  const criticalKeywords = [
    { word: '금리인상', weight: 10 },
    { word: '금리인하', weight: 10 },
    { word: '기준금리', weight: 9 },
    { word: '주가폭락', weight: 9 },
    { word: '주가폭등', weight: 8 },
    { word: '코스피', weight: 8 },
    { word: '환율급등', weight: 8 },
    { word: '환율급락', weight: 8 },
    { word: '부동산폭락', weight: 8 },
    { word: '부동산급등', weight: 8 },
    { word: '경제위기', weight: 10 },
    { word: '금융위기', weight: 10 },
    { word: '실업급증', weight: 9 },
    { word: '인플레이션', weight: 8 },
    { word: '디플레이션', weight: 8 },
    { word: '긴급', weight: 7 },
    { word: '급락', weight: 7 },
    { word: '급등', weight: 7 },
    { word: '폭락', weight: 7 },
    { word: '폭등', weight: 7 },
  ];

  const titleLower = title.toLowerCase();
  criticalKeywords.forEach(({ word, weight }) => {
    if (titleLower.includes(word)) {
      score += weight;
    }
  });

  // 2. 숫자/퍼센트 기반 점수
  if (/\d+%/.test(title)) score += 3; // 퍼센트 포함
  if (/\d+조/.test(title)) score += 2; // 큰 금액
  if (/\d+억/.test(title)) score += 1; // 중간 금액

  // 3. 부정/긍정 감정 점수
  const negativeWords = ['하락', '감소', '악화', '위기', '부도', '손실'];
  const positiveWords = ['상승', '증가', '개선', '호황', '성장', '이익'];

  negativeWords.forEach(word => {
    if (titleLower.includes(word)) score += 2;
  });

  positiveWords.forEach(word => {
    if (titleLower.includes(word)) score += 1;
  });

  return score;
}

/**
 * 뉴스 카테고리 분류
 */
function categorizeNews(title) {
  const categories = {
    '금리/통화': ['금리', '기준금리', '통화', '금리인상', '금리인하', '한은'],
    '주식': ['주가', '코스피', '코스닥', '주식', '증권', '상장'],
    '환율': ['환율', '원달러', '엔화', '위안화', '환율급등'],
    '부동산': ['부동산', '집값', '전세', '월세', '아파트', '주택'],
    '고용': ['실업', '취업', '고용', '채용', '실직', '일자리'],
    '물가': ['물가', '인플레이션', '디플레이션', '소비자물가'],
    '기업': ['기업', '실적', '배당', '주주', '경영', '회사'],
    '암호화폐': ['암호화폐', '비트코인', '이더리움', '블록체인', '디지털자산'],
    '정책': ['정책', '규제', '법안', '개혁', '정부', '청와대'],
    '국제': ['수출', '수입', '무역', '국제', '해외', '미국', '중국']
  };

  const titleLower = title.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(kw => titleLower.includes(kw))) {
      return category;
    }
  }

  return '경제일반';
}

/**
 * 뉴스 요약 생성 (간단한 버전)
 */
function generateSummary(title) {
  // 제목에서 핵심 정보 추출
  const words = title.split(' ');
  
  // 중요한 단어들 필터링
  const importantWords = words.filter(word => 
    word.length > 2 && !['및', '등', '등등', '이번', '지난'].includes(word)
  );

  // 처음 10개 단어로 요약
  const summary = importantWords.slice(0, 10).join(' ');
  
  return summary || title;
}

/**
 * 뉴스 분석 및 필터링
 */
function analyzeNews(newsArray) {
  return newsArray.map(news => ({
    ...news,
    importance: calculateImportanceScore(news.title),
    category: categorizeNews(news.title),
    summary: generateSummary(news.title)
  })).sort((a, b) => b.importance - a.importance);
}

/**
 * 카테고리별 상위 뉴스 선택
 */
function selectTopNewsByCategory(analyzedNews) {
  const categoryMap = {};

  analyzedNews.forEach(news => {
    if (!categoryMap[news.category]) {
      categoryMap[news.category] = [];
    }
    categoryMap[news.category].push(news);
  });

  const topNews = [];
  Object.entries(categoryMap).forEach(([category, news]) => {
    // 각 카테고리에서 상위 2개씩 선택
    topNews.push(...news.slice(0, 2));
  });

  // 중요도로 정렬 후 상위 15개 반환
  return topNews.sort((a, b) => b.importance - a.importance).slice(0, 15);
}

/**
 * 투자 인사이트 생성
 */
function generateInvestmentInsights(topNews) {
  const categories = {};
  
  topNews.forEach(news => {
    if (!categories[news.category]) {
      categories[news.category] = [];
    }
    categories[news.category].push(news);
  });

  const insights = {
    title: '오늘의 투자 인사이트',
    summary: '오늘의 주요 경제 뉴스를 분석한 투자 관점입니다.',
    topCategories: Object.entries(categories)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3)
      .map(([category, news]) => ({
        category,
        count: news.length,
        topNews: news[0].title
      })),
    recommendation: generateRecommendation(topNews),
    riskLevel: calculateRiskLevel(topNews),
    sectors: [
      { name: 'IT/기술', outlook: '긍정적', reason: '디지털 전환 가속화' },
      { name: '금융', outlook: '중립', reason: '금리 정책 영향' },
      { name: '에너지', outlook: '중립', reason: '국제 유가 변동' }
    ]
  };

  return insights;
}

/**
 * 투자 추천 생성
 */
function generateRecommendation(topNews) {
  let recommendation = '분산 투자를 권장합니다.';

  const hasNegativeNews = topNews.some(news => 
    news.title.includes('하락') || news.title.includes('위기')
  );

  const hasPositiveNews = topNews.some(news => 
    news.title.includes('상승') || news.title.includes('성장')
  );

  if (hasNegativeNews && !hasPositiveNews) {
    recommendation = '방어적 투자 전략을 권장합니다.';
  } else if (hasPositiveNews && !hasNegativeNews) {
    recommendation = '공격적 투자 전략을 권장합니다.';
  }

  return recommendation;
}

/**
 * 위험 수준 계산
 */
function calculateRiskLevel(topNews) {
  const riskKeywords = ['위기', '폭락', '급락', '손실', '부도'];
  const riskCount = topNews.filter(news =>
    riskKeywords.some(kw => news.title.includes(kw))
  ).length;

  if (riskCount >= 3) return '높음';
  if (riskCount >= 1) return '중간';
  return '낮음';
}

/**
 * 메인 함수
 */
async function main() {
  try {
    console.log('🔍 뉴스 분석 시작...\n');

    // 수집된 뉴스 읽기
    const newsPath = path.join(DATA_DIR, 'news.json');
    
    if (!fs.existsSync(newsPath)) {
      console.error('❌ 뉴스 데이터를 찾을 수 없습니다.');
      process.exit(1);
    }

    const newsData = JSON.parse(fs.readFileSync(newsPath, 'utf-8'));
    const news = newsData.news || [];

    // 뉴스 분석
    const analyzedNews = analyzeNews(news);

    // 카테고리별 상위 뉴스 선택
    const topNews = selectTopNewsByCategory(analyzedNews);

    // 투자 인사이트 생성
    const insights = generateInvestmentInsights(topNews);

    // 분석 결과 저장
    const analysisPath = path.join(DATA_DIR, 'analysis.json');
    fs.writeFileSync(analysisPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      totalAnalyzed: analyzedNews.length,
      topNews,
      insights
    }, null, 2));

    console.log('✅ 뉴스 분석 완료!');
    console.log(`📊 분석된 뉴스: ${analyzedNews.length}개`);
    console.log(`🔝 선택된 뉴스: ${topNews.length}개`);
    console.log(`📁 저장 위치: ${analysisPath}`);

    // 상위 5개 뉴스 표시
    console.log('\n🔝 상위 뉴스 (중요도 순):');
    topNews.slice(0, 5).forEach((news, idx) => {
      console.log(`${idx + 1}. [${news.category}] ${news.title}`);
      console.log(`   중요도: ${news.importance} | 출처: ${news.source}`);
    });

    console.log('\n💡 투자 인사이트:');
    console.log(`   ${insights.recommendation}`);
    console.log(`   위험 수준: ${insights.riskLevel}`);

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

main();
