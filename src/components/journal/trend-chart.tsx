import React from 'react';
import { EmotionTrend, Sentiment } from '@/@types/journal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dayjs from 'dayjs';

interface TrendChartProps {
  trends: EmotionTrend[];
  days?: number;
}

const TrendChart: React.FC<TrendChartProps> = ({ trends, days = 7 }) => {
  const getSentimentColor = (sentiment?: Sentiment) => {
    if (!sentiment) return 'bg-gray-300';
    
    switch (sentiment) {
      case Sentiment.POSITIVE:
        return 'bg-green-500';
      case Sentiment.NEUTRAL:
        return 'bg-gray-400';
      case Sentiment.NEGATIVE:
        return 'bg-orange-500';
      case Sentiment.VERY_NEGATIVE:
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getSentimentHeight = (emotionScore?: number) => {
    if (!emotionScore) return '20%';
    return `${emotionScore}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          Xu hướng cảm xúc {days} ngày
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-end justify-between h-32 gap-2">
          {trends.length === 0 ? (
            <div className="w-full flex items-center justify-center text-muted-foreground text-sm">
              Chưa có dữ liệu
            </div>
          ) : (
            trends.map((trend, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-muted rounded-t relative h-24">
                  <div
                    className={`absolute bottom-0 w-full rounded-t transition-all ${getSentimentColor(
                      trend.sentiment
                    )}`}
                    style={{ height: getSentimentHeight(trend.emotionScore) }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {dayjs(trend.date).format('DD/MM')}
                </span>
              </div>
            ))
          )}
        </div>

        {trends.length > 0 && (
          <div className="mt-4 text-xs text-center text-muted-foreground">
            Điểm cảm xúc trung bình:{' '}
            <span className="font-semibold">
              {(trends.reduce((sum, t) => sum + (t.emotionScore || 0), 0) / trends.length).toFixed(
                1
              )}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendChart;

