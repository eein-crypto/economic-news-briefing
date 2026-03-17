import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';

interface PredictionRecord {
  id: string;
  date: string;
  prediction: string;
  direction: 'up' | 'down' | 'neutral';
  actualResult?: 'correct' | 'incorrect' | 'pending';
  verificationDate?: string;
  notes?: string;
}

export default function InvestmentTracker() {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [accuracy, setAccuracy] = useState(0);

  // Load predictions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('investmentPredictions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setPredictions(parsed);
      calculateAccuracy(parsed);
    }
  }, []);

  // Save predictions to localStorage
  const savePredictions = (newPredictions: PredictionRecord[]) => {
    localStorage.setItem('investmentPredictions', JSON.stringify(newPredictions));
    setPredictions(newPredictions);
    calculateAccuracy(newPredictions);
  };

  const calculateAccuracy = (records: PredictionRecord[]) => {
    const verified = records.filter(r => r.actualResult);
    if (verified.length === 0) {
      setAccuracy(0);
      return;
    }
    const correct = verified.filter(r => r.actualResult === 'correct').length;
    setAccuracy(Math.round((correct / verified.length) * 100));
  };

  const addPrediction = (prediction: string, direction: 'up' | 'down' | 'neutral') => {
    const newRecord: PredictionRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      prediction,
      direction,
      actualResult: 'pending'
    };
    savePredictions([...predictions, newRecord]);
  };

  const verifyPrediction = (id: string, isCorrect: boolean) => {
    const updated = predictions.map(p =>
      p.id === id
        ? {
            ...p,
            actualResult: (isCorrect ? 'correct' : 'incorrect') as 'correct' | 'incorrect',
            verificationDate: new Date().toISOString().split('T')[0]
          }
        : p
    );
    savePredictions(updated);
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-blue-600" />;
    }
  };

  const getResultBadge = (result?: string) => {
    switch (result) {
      case 'correct':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">맞음</span>;
      case 'incorrect':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">틀림</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">검증 대기</span>;
      default:
        return null;
    }
  };

  const pendingPredictions = predictions.filter(p => p.actualResult === 'pending');
  const verifiedPredictions = predictions.filter(p => p.actualResult !== 'pending');

  return (
    <div className="space-y-6">
      {/* Accuracy Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">투자 예측 정확도</p>
            <p className="text-4xl font-bold text-primary">{accuracy}%</p>
            <p className="text-xs text-muted-foreground mt-2">
              {verifiedPredictions.length}개 검증 완료
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-2">대기 중인 예측</p>
            <p className="text-3xl font-bold text-amber-600">{pendingPredictions.length}</p>
          </div>
        </div>
      </div>

      {/* Pending Predictions */}
      {pendingPredictions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">🔄 검증 대기 중인 예측</h3>
          <div className="space-y-3">
            {pendingPredictions.map(pred => (
              <div key={pred.id} className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getDirectionIcon(pred.direction)}
                    <div>
                      <p className="font-medium text-foreground">{pred.prediction}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(pred.date).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                  {getResultBadge(pred.actualResult)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => verifyPrediction(pred.id, true)}
                    className="flex-1 px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded hover:bg-green-200 transition-colors"
                  >
                    ✓ 맞음
                  </button>
                  <button
                    onClick={() => verifyPrediction(pred.id, false)}
                    className="flex-1 px-3 py-2 bg-red-100 text-red-700 text-sm font-medium rounded hover:bg-red-200 transition-colors"
                  >
                    ✗ 틀림
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verified Predictions */}
      {verifiedPredictions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">✅ 검증 완료된 예측</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {verifiedPredictions.map(pred => (
              <div key={pred.id} className="bg-white border border-border rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getDirectionIcon(pred.direction)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{pred.prediction}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(pred.date).toLocaleDateString('ko-KR')} → {new Date(pred.verificationDate || '').toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>
                {getResultBadge(pred.actualResult)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {predictions.length === 0 && (
        <div className="text-center py-8 bg-secondary rounded-lg">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">아직 기록된 예측이 없습니다.</p>
          <p className="text-sm text-muted-foreground mt-1">매일의 투자 리포트가 자동으로 저장됩니다.</p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>💡 팁:</strong> 매일의 투자 리포트에서 제시된 예측들이 자동으로 기록됩니다. 1주일, 1개월, 3개월 후 실제 결과와 비교하여 정확도를 확인할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
