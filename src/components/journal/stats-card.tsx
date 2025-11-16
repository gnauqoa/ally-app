import React from 'react';
import { JournalStats } from '@/@types/journal';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, BarChart3, Smile } from 'lucide-react';

interface StatsCardProps {
  stats: JournalStats | null;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  if (!stats) {
    return null;
  }

  const getMostCommonSentiment = () => {
    const sentiments = stats.sentiments;
    if (!sentiments || Object.keys(sentiments).length === 0) return 'N/A';
    
    const entries = Object.entries(sentiments);
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  };

  const getSentimentLabel = (sentiment: string) => {
    const labels: Record<string, string> = {
      POSITIVE: 'Tích cực',
      NEUTRAL: 'Bình thường',
      NEGATIVE: 'Tiêu cực',
      VERY_NEGATIVE: 'Rất tiêu cực',
    };
    return labels[sentiment] || sentiment;
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Tổng số
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalEntries}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              Đã phân tích
            </span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.analyzedEntries}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-purple-50 dark:bg-purple-900/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Smile className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              Phổ biến
            </span>
          </div>
          <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
            {getSentimentLabel(getMostCommonSentiment())}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCard;

