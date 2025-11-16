import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, RefreshCw, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { generatePrompts } from '@/redux/slices/journal';

interface TopicSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
}

const TopicSuggestions: React.FC<TopicSuggestionsProps> = ({ onSelectPrompt }) => {
  const dispatch = useAppDispatch();
  const { prompts, loading } = useAppSelector((state) => state.journal);

  useEffect(() => {
    if (prompts.length === 0) {
      dispatch(generatePrompts());
    }
  }, []);

  const handleRefresh = () => {
    dispatch(generatePrompts());
  };

  if (loading && prompts.length === 0) {
    return (
      <Card className="bg-amber-50 dark:bg-amber-900/20">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-amber-50 dark:bg-amber-900/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <CardTitle className="text-sm text-amber-900 dark:text-amber-100">
              Gợi ý chủ đề
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={loading}
            className="h-8 w-8 text-amber-600 dark:text-amber-400 hover:text-amber-700"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {prompts.length > 0 ? (
            prompts.map((prompt, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-800"
                onClick={() => onSelectPrompt(prompt)}
              >
                {prompt}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Nhấn refresh để tạo gợi ý
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicSuggestions;

