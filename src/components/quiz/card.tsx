import { Quiz } from "@/@types/quiz";
import { getInterpretation } from "@/lib/score";
import dayjs from "dayjs";
import clsx from "clsx";
import { stringToColor } from "@/lib/utils";

interface QuizItemProps {
  quiz: Quiz;
  onClick: (quizId: number) => void;
}

export default function QuizItem({ quiz, onClick }: QuizItemProps) {
  const interpretation =
    quiz.results && quiz.results.length > 0
      ? getInterpretation(quiz.results[0].totalScore, quiz.code)
      : undefined;

  return (
    <div
      className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted cursor-pointer"
      onClick={() => onClick(quiz.id)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p
            style={{ color: stringToColor(quiz.name) }}
            className="font-medium truncate text-2xl flex-1 min-w-0"
          >
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
              {dayjs(quiz.updatedAt).format("DD-MM-YYYY")}
            </p>
          </div>
        </div>
        {interpretation && quiz.results && quiz.results.length > 0 ? (
          <div className="bg-background/10 p-4 rounded-lg border mt-4">
            <p
              className="text-sm  font-semibold "
              style={{ marginTop: 0, marginBottom: 6 }}
            >
              Kết quả gần đây
            </p>
            <p className={clsx(`text-md font-bold`, interpretation.color)}>
              {quiz.results[0].totalScore} - {interpretation.level}
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
