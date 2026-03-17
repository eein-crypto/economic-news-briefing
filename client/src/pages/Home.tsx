import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import InvestmentReport from '@/components/InvestmentReport';
import NewsDetailModal from '@/components/NewsDetailModal';
import { fetchBriefingData } from '@/lib/api';
import { BriefingData, NewsItem } from '@/lib/types';
import { Loader2, Settings } from 'lucide-react';

export default function Home() {
  const [, setLocation] = useLocation();
  const [data, setData] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const briefingData = await fetchBriefingData();
      setData(briefingData);
    } catch (err) {
      setError('데이터를 불러올 수 없습니다. 나중에 다시 시도해주세요.');
      console.error('Error loading briefing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsClick = (news: NewsItem) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">뉴스를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header lastUpdated={new Date().toISOString()} onRefresh={loadData} isLoading={loading} />
        <main className="container py-8 md:py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium mb-4">{error || '데이터를 불러올 수 없습니다.'}</p>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header lastUpdated={data.lastUpdated} onRefresh={loadData} isLoading={loading} />

      {/* Settings Button */}
      <div className="container py-3 md:py-4 flex justify-end">
        <button
          onClick={() => setLocation('/settings')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
        >
          <Settings className="w-4 h-4" />
          설정
        </button>
      </div>

      <main className="flex-1">
        <div className="container py-8 md:py-12">
          {/* Welcome Section */}
          <section className="mb-8 md:mb-12">
            <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-6 md:p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">좋은 아침입니다! 👋</h2>
              <p className="text-base md:text-lg opacity-95">
                오늘의 경제 뉴스를 확인해 보세요. 어렵지 않아요!
              </p>
            </div>
          </section>

          {/* News Grid */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">📰 오늘의 경제 뉴스</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {data.news.map(news => (
                <NewsCard 
                  key={news.id} 
                  news={news}
                  onDetailClick={handleNewsClick}
                />
              ))}
            </div>
          </section>

          {/* Investment Report */}
          <section className="mb-12 md:mb-16">
            <InvestmentReport report={data.investmentReport} />
          </section>

          {/* Footer Info */}
          <section className="text-center py-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">
              📅 {new Date(data.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
            <p className="text-xs text-muted-foreground">
              뉴스 출처: 한국경제 | 매일 아침 설정된 시간에 자동으로 업데이트됩니다
            </p>
          </section>
        </div>
      </main>

      {/* News Detail Modal */}
      {selectedNews && (
        <NewsDetailModal
          news={selectedNews}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
