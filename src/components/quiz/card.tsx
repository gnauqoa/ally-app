import { Quiz } from "@/@types/quiz";
import { ChevronRight } from "lucide-react";
import ResultBadge from "./result-badge";

interface QuizItemProps {
  quiz: Quiz;
  onClick: (quizId: number) => void;
}

const QuizItem = ({ quiz, onClick }: QuizItemProps) => {
  const latestResult = quiz.results?.length
    ? [...quiz.results].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]
    : undefined;

  return (
    <div
      className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/80 p-4 shadow-sm transition-colors hover:bg-accent/40 cursor-pointer"
      onClick={() => onClick(quiz.id)}
    >
      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-row items-center">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {quiz.code}
              </p>
              <ChevronRight className="h-6 w-6 ml-auto" />
            </div>
            <p className="text-xl font-semibold text-foreground truncate">
              {quiz.name}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {quiz.description}
            </p>
          </div>
        </div>
        <ResultBadge result={latestResult} code={quiz.code} />
      </div>
    </div>
  );
};

export default QuizItem;
