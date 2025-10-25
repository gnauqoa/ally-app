import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, BookOpen, Plus } from "lucide-react";
import { deleteQuiz, getQuizzes, Quiz } from "@/lib/quiz-storage";

export default function QuizPage() {
  const history = useHistory();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const loadedQuizzes = getQuizzes();
    setQuizzes(
      loadedQuizzes.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    );
    setIsLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    deleteQuiz(id);
    setQuizzes(quizzes.filter((q) => q.id !== id));
  };

  const handleQuizClick = (quizId: string) => {
    history.push(`/quiz/take/${quizId}`);
  };

  const handleCreateQuiz = () => {
    history.push("/quiz/create");
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="w-full">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Quizzes</h1>
            <Button onClick={handleCreateQuiz} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Quiz
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : quizzes.length === 0 ? (
            <div
              className="w-full rounded-lg border border-border bg-card p-8 text-center cursor-pointer"
              onClick={handleCreateQuiz}
            >
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                No quizzes yet. Create your first quiz!
              </p>
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
                    <p className="font-medium text-foreground truncate text-2xl">
                      {quiz.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {quiz.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {quiz.questions.length} questions •{" "}
                      {new Date(quiz.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(quiz.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

