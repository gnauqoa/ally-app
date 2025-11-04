import { Result } from "@/@types/result";
import { Card } from "./ui/card";
import { getInterpretation } from "@/lib/score";
import dayjs from "dayjs";
import { stringToColor } from "@/lib/utils";

const ResultHistoryItem = ({ result }: { result: Result }) => {
  const interpretation = getInterpretation(
    result.totalScore,
    result.quiz?.code || ""
  );
  return (
    <Card className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
      <div>
        <p
          className="text-sm font-semibold mb-1"
          style={{
            color: stringToColor(result.quiz?.name || ""),
          }}
        >
          {result.quiz?.name}
        </p>
        <p className={`text-lg font-bold ${interpretation?.color}`}>
          {result.totalScore} - {interpretation?.level}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {dayjs(result.createdAt).format("DD-MM-YYYY")}
        </p>
      </div>
    </Card>
  );
};

export default ResultHistoryItem;
