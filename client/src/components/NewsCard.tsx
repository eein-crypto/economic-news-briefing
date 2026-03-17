import { NewsItem, CATEGORY_CONFIG } from '@/lib/types';
import { formatTime } from '@/lib/api';
import { ExternalLink, Clock } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
  onDetailClick?: (news: NewsItem) => void;
}

const categoryColorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  teal: 'bg-teal-100 text-teal-700 border-teal-200',
  green: 'bg-green-100 text-green-700 border-green-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200'
};

export default function NewsCard({ news, onDetailClick }: NewsCardProps) {
  const categoryConfig = CATEGORY_CONFIG[news.category];
  const colorClass = categoryColorMap[categoryConfig.color];

  return (
    <article className="bg-white border border-border rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow duration-300 hover:translate-y-[-2px]">
      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}>
          <span>{categoryConfig.icon}</span>
          <span>{categoryConfig.label}</span>
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          {formatTime(news.publishedAt)}
        </span>
      </div>

      <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 leading-tight line-clamp-2">
        {news.title}
      </h3>

      <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed line-clamp-3">
        {news.summary}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>약 {news.readingTime}분 읽기</span>
        </div>
        <button
          onClick={() => onDetailClick?.(news)}
          className="inline-flex items-center gap-1 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          자세히 보기
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </article>
  );
}
