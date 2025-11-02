import { useEffect } from "react";
import { useIonRouter } from "@ionic/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchQuizzes, clearError } from "@/redux/slices/quiz";
import { AlertCircle } from "lucide-react";
import { GET_ROUTE_PATHS } from "@/lib/constant";

export default function QuizPage() {
  const router = useIonRouter();
  const dispatch = useAppDispatch();
  const { quizzes, isLoading, error } = useAppSelector((state) => state.quiz);
  useEffect(() => {
    dispatch(fetchQuizzes({ page: 1, limit: 50 }));
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleQuizClick = (quizId: number) => {
    router.push(GET_ROUTE_PATHS.QUIZ_TAKE(quizId), "root");
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex-1 py-6 sm:px-6">
        <div className="w-full">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  Error loading quizzes
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {error}
                </p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              Loading tests...
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No tests yet.
            </div>
          ) : (
            <div className="space-y-3">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted cursor-pointer"
                  onClick={() => handleQuizClick(quiz.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground truncate text-2xl flex-1 min-w-0">
                        {quiz.name}
                      </p>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap flex-shrink-0">
                        {quiz.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-row min-w-0">
                      <div className="flex-1 flex-row">
                        <p className="text-sm text-muted-foreground mt-1">
                          {quiz.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {quiz.code} • {quiz.totalQuestions} questions •{" "}
                          {new Date(quiz.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
