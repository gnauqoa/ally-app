import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, RefreshCw, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { generatePrompts } from "@/redux/slices/journal";

interface TopicSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
}

const TopicSuggestions: React.FC<TopicSuggestionsProps> = ({
  onSelectPrompt,
}) => {
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

  // Initial loading state (no prompts yet)
  if (loading && prompts.length === 0) {
    return (
      <Card className="bg-amber-50 dark:bg-amber-900/20">
        <CardHeader className="px-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <CardTitle className="text-sm text-amber-900 dark:text-amber-100">
              Gợi ý chủ đề
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Đang tạo gợi ý cho bạn...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state when no prompts after loading
  if (!loading && prompts.length === 0) {
    return (
      <Card className="bg-amber-50 dark:bg-amber-900/20">
        <CardHeader className="px-4">
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
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-6">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Không thể tạo gợi ý. Hãy thử lại.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Skeleton loaders while refreshing (when prompts already exist)
  const displayPrompts = loading ? Array(3).fill(null) : prompts;

  return (
    <Card className="bg-amber-50 dark:bg-amber-900/20 gap-0 py-4">
      <CardHeader className="px-4">
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
            title={loading ? "Đang tải..." : "Làm mới"}
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
          {displayPrompts.map((prompt, index) => (
            loading && !prompt ? (
              // Skeleton loader
              <div
                key={index}
                className="h-8 w-24 rounded-sm bg-amber-200 dark:bg-amber-800 animate-pulse"
              />
            ) : (
              // Actual prompt badge
              <Badge
                key={index}
                variant="secondary"
                className={`rounded-sm p-3 ${
                  loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-800"
                }`}
                onClick={() => !loading && onSelectPrompt(prompt as string)}
              >
                {prompt}
              </Badge>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicSuggestions;
