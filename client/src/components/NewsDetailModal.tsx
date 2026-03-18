import { NewsItem, CATEGORY_CONFIG } from '@/lib/types';
import { formatTime } from '@/lib/api';
import { X, ExternalLink, Clock } from 'lucide-react';

interface NewsDetailModalProps {
  news: NewsItem;
  isOpen: boolean;
  onClose: () => void;
}

const categoryColorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  teal: 'bg-teal-100 text-teal-700 border-teal-200',
  green: 'bg-green-100 text-green-700 border-green-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200'
};

export default function NewsDetailModal({ news, isOpen, onClose }: NewsDetailModalProps) {
  if (!isOpen) return null;

  const categoryConfig = CATEGORY_CONFIG[news.category];
  const colorClass = categoryColorMap[categoryConfig.color];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 md:p-0 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-3xl my-8 md:my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}>
              <span>{categoryConfig.icon}</span>
              <span>{categoryConfig.label}</span>
            </span>
            <span className="text-xs text-muted-foreground">{formatTime(news.publishedAt)}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1">
          <div className="p-4 md:p-6">
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {news.title}
            </h2>

            {/* Meta Info */}
            <div className="flex items-center gap-2 mb-6 pb-6 border-b border-border text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '날짜 미정'}</span>
            </div>

            {/* Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-3">📌 요약</h3>
              <p className="text-base text-muted-foreground leading-relaxed bg-secondary rounded-lg p-4">
                {news.summary}
              </p>
            </div>

            {/* Detailed Explanation */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-3">📖 이 뉴스가 뭐예요?</h3>
              <div className="text-base text-muted-foreground leading-relaxed space-y-4">
                {typeof news.detailedExplanation === 'string' ? (
                  news.detailedExplanation.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="whitespace-pre-wrap">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">{news.detailedExplanation.title}</h4>
                      <p className="text-blue-800">{news.detailedExplanation.content}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2">{news.detailedExplanation.meaning}</h4>
                      <p className="text-green-800">{news.detailedExplanation.meaningContent}</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h4 className="font-semibold text-amber-900 mb-2">{news.detailedExplanation.impact}</h4>
                      <p className="text-amber-800">{news.detailedExplanation.impactContent}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Read More Button */}
            <div className="pt-6 border-t border-border">
              <a
                href={news.sourceUrl || news.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                원문 기사 보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
