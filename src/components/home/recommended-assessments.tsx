import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { useIonRouter } from "@ionic/react";
import { GET_ROUTE_PATHS } from "@/lib/constant";

export default function RecommendedAssessments() {
  const router = useIonRouter();
  const { quizzes } = useAppSelector((state) => state.quiz);
  const { results } = useAppSelector((state) => state.result);

  // Get quizzes that user hasn't taken yet or taken long ago
  const recommendedQuizzes = quizzes
    .filter((quiz) => {
      const lastResult = results
        .filter((r) => r.quizId === quiz.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      
      // Recommend if never taken or taken more than 7 days ago
      if (!lastResult) return true;
      
      const daysSinceLastTaken = Math.floor(
        (Date.now() - new Date(lastResult.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      return daysSinceLastTaken >= 7;
    })
    .slice(0, 3);

  const handleTakeQuiz = (quizId: number) => {
    router.push(GET_ROUTE_PATHS.QUIZ_TAKE(quizId));
  };

  const handleViewAll = () => {
    router.push("/quiz");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Đánh giá được đề xuất
          </CardTitle>
          <button
            onClick={handleViewAll}
            className="text-sm text-primary hover:underline"
          >
            Xem tất cả
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {recommendedQuizzes.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Không có đánh giá mới để làm
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendedQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{quiz.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                      {quiz.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="flex-shrink-0">
                    {quiz.code}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{quiz.totalQuestions} câu hỏi</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTakeQuiz(quiz.id)}
                    className="h-7"
                  >
                    Làm ngay
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

