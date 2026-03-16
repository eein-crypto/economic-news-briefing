import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  lastUpdated: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function Header({ lastUpdated, onRefresh, isLoading }: HeaderProps) {
  const formattedTime = new Date(lastUpdated).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container py-4 md:py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2">
              <span className="text-xl">📈</span>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-foreground">경제 뉴스 브리핑</h1>
              <p className="text-xs md:text-sm text-muted-foreground">초등학생도 이해하는 경제</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">마지막 업데이트</p>
              <p className="text-sm font-medium text-foreground">{formattedTime}</p>
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="새로고침"
              >
                <RefreshCw className={`w-5 h-5 text-primary ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
