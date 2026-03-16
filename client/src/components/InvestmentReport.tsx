import { TrendingUp, Lightbulb } from 'lucide-react';

interface InvestmentReportProps {
  report: string;
}

export default function InvestmentReport({ report }: InvestmentReportProps) {
  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 md:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-amber-100 rounded-full p-3">
          <TrendingUp className="w-6 h-6 text-amber-700" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">오늘의 투자 인사이트</h2>
      </div>

      <div className="bg-white rounded-lg p-4 md:p-6 mb-4 border border-amber-100">
        <p className="text-sm md:text-base text-foreground leading-relaxed whitespace-pre-wrap">
          {report}
        </p>
      </div>

      <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-amber-100">
        <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs md:text-sm text-muted-foreground">
          💡 <strong>팁:</strong> 투자는 장기적인 관점에서 생각하는 것이 중요해요. 하루하루의 변화에 흔들리지 말고, 꾸준히 배우고 준비하세요!
        </p>
      </div>
    </section>
  );
}
