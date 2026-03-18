import { useState, useEffect, useRef } from 'react';
import { BriefingData } from '@/lib/types';
import { fetchBriefingData } from '@/lib/api';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import NewsDetailModal from '@/components/NewsDetailModal';
import InvestmentReport from '@/components/InvestmentReport';
import InvestmentTracker from '@/components/InvestmentTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, navigate] = useLocation();
  const trackerRef = useRef<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const briefingData = await fetchBriefingData();
      setData(briefingData);
      
      // Auto-save predictions from news items
      if (briefingData.news && briefingData.news.length > 0) {
        setTimeout(() => {
          savePredictionsFromNews(briefingData.news);
        }, 500);
      }
    } catch (error) {
      console.error('Failed to load briefing data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const savePredictionsFromNews = (news: any[]) => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('investmentPredictions');
    const existing = saved ? JSON.parse(saved) : [];
    
    // Check if predictions for today are already saved
    const todayPredictions = existing.filter((p: any) => p.date === today);
    if (todayPredictions.length > 0) return; // Already saved
    
    // Extract predictions from news items
    const newPredictions = news
      .filter(item => item.investmentOpinion)
      .map((item, index) => ({
        id: `pred_${today}_${index}`,
        date: today,
        prediction: `${item.title}: ${item.investmentOpinion.opinion}`,
        direction: item.investmentOpinion.sentiment === 'positive' ? 'up' : item.investmentOpinion.sentiment === 'negative' ? 'down' : 'neutral',
        actualResult: 'pending',
        newsId: item.id
      }));
    
    // Save to localStorage
    const allPredictions = [...existing, ...newPredictions];
    localStorage.setItem('investmentPredictions', JSON.stringify(allPredictions));
  };

  const handleNewsClick = (news: any) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">브리핑을 준비 중입니다...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">데이터를 불러올 수 없습니다.</p>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onRefresh={loadData} lastUpdated={data.lastUpdated} />

      <main className="container py-8">
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="news">📰 뉴스</TabsTrigger>
            <TabsTrigger value="report">📊 투자 리포트</TabsTrigger>
            <TabsTrigger value="tracker">📈 예측 추적</TabsTrigger>
          </TabsList>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg p-6 md:p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">좋은 아침입니다! 👋</h2>
              <p className="text-blue-50">오늘의 경제 뉴스를 확인해 보세요. 어렵지 않아요!</p>
            </div>

            {/* News Grid */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                📰 오늘의 경제 뉴스
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {data.news.map(news => (
                  <NewsCard
                    key={news.id}
                    news={news}
                    onDetailClick={() => handleNewsClick(news)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Investment Report Tab */}
          <TabsContent value="report">
            <InvestmentReport report={data.investmentReport} />
          </TabsContent>

          {/* Investment Tracker Tab */}
          <TabsContent value="tracker">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                📈 투자 예측 검증 시스템
              </h3>
              <p className="text-muted-foreground">
                매일의 투자 리포트에서 제시된 예측들을 기록하고, 시간이 지난 후 실제 결과와 비교하여 정확도를 확인할 수 있습니다.
              </p>
              <InvestmentTracker />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* News Detail Modal */}
      {selectedNews && (
        <NewsDetailModal
          news={selectedNews}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNews(null);
          }}
        />
      )}
    </div>
  );
}
