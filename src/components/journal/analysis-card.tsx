import React from 'react';
import { JournalAnalysis, Sentiment } from '@/@types/journal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Smile,
  Frown,
  Minus,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface AnalysisCardProps {
  analysis: JournalAnalysis;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  const getSentimentIcon = (sentiment: Sentiment) => {
    switch (sentiment) {
      case Sentiment.POSITIVE:
        return Smile;
      case Sentiment.NEGATIVE:
      case Sentiment.VERY_NEGATIVE:
        return Frown;
      default:
        return Minus;
    }
  };

  const getSentimentColor = (sentiment: Sentiment) => {
    switch (sentiment) {
      case Sentiment.POSITIVE:
        return 'text-green-600 dark:text-green-400';
      case Sentiment.NEUTRAL:
        return 'text-gray-600 dark:text-gray-400';
      case Sentiment.NEGATIVE:
        return 'text-orange-600 dark:text-orange-400';
      case Sentiment.VERY_NEGATIVE:
        return 'text-red-600 dark:text-red-400';
    }
  };

  const getSentimentLabel = (sentiment: Sentiment) => {
    const labels = {
      [Sentiment.POSITIVE]: 'Tích cực',
      [Sentiment.NEUTRAL]: 'Bình thường',
      [Sentiment.NEGATIVE]: 'Tiêu cực',
      [Sentiment.VERY_NEGATIVE]: 'Rất tiêu cực',
    };
    return labels[sentiment];
  };

  const getSentimentBgColor = (sentiment: Sentiment) => {
    switch (sentiment) {
      case Sentiment.POSITIVE:
        return 'bg-green-50 dark:bg-green-900/20';
      case Sentiment.NEUTRAL:
        return 'bg-gray-50 dark:bg-gray-800';
      case Sentiment.NEGATIVE:
        return 'bg-orange-50 dark:bg-orange-900/20';
      case Sentiment.VERY_NEGATIVE:
        return 'bg-red-50 dark:bg-red-900/20';
    }
  };

  const SentimentIcon = getSentimentIcon(analysis.sentiment);

  return (
    <Card className={getSentimentBgColor(analysis.sentiment)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Kết quả phân tích AI</CardTitle>
          <SentimentIcon className={`h-8 w-8 ${getSentimentColor(analysis.sentiment)}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sentiment & Score */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Cảm xúc</p>
            <p className={`text-lg font-semibold ${getSentimentColor(analysis.sentiment)}`}>
              {getSentimentLabel(analysis.sentiment)}
            </p>
          </div>
          {analysis.emotionScore !== undefined && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Điểm cảm xúc</p>
              <p className="text-lg font-semibold">
                {analysis.emotionScore}/100
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        {analysis.aiSummary && (
          <div>
            <p className="text-sm font-medium mb-2">Tóm tắt</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.aiSummary}
            </p>
          </div>
        )}

        {/* Identified Issues */}
        {analysis.identifiedIssues && analysis.identifiedIssues.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <p className="text-sm font-medium">
                Vấn đề được phát hiện
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.identifiedIssues.map((issue, index) => (
                <Badge key={index} variant="warning">
                  {issue}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {analysis.aiRecommendations && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium">Đề xuất</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.aiRecommendations}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisCard;

