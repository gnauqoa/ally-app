import { Result } from "@/@types/result";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ChevronRight } from "lucide-react";
import { getInterpretation } from "@/lib/score";
import dayjs from "dayjs";
import { stringToColor } from "@/lib/utils";
import { useIonRouter } from "@ionic/react";

const ResultHistoryItem = ({ result }: { result: Result }) => {
  const router = useIonRouter();
  const interpretation = getInterpretation(
    result.totalScore,
    result.quiz?.code || ""
  );

  const handleClick = () => {
    router.push(`/result-history/${result.id}`);
  };

  return (
    <Card
      className="p-4 rounded-lg border border-border cursor-pointer hover:bg-muted transition-colors"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <p
            className="text-sm font-semibold mb-1"
            style={{
              color: stringToColor(result.quiz?.name || ""),
            }}
          >
            {result.quiz?.name}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <p className={`text-lg font-bold ${interpretation?.color}`}>
              {result.totalScore}
            </p>
            <Badge
              variant={
                interpretation?.level.includes("Minimal") ||
                interpretation?.level.includes("Nhẹ")
                  ? "success"
                  : interpretation?.level.includes("Severe") ||
                    interpretation?.level.includes("Nghiêm trọng")
                  ? "destructive"
                  : "warning"
              }
            >
              {interpretation?.level}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {dayjs(result.createdAt).format("DD/MM/YYYY HH:mm")}
          </p>
          {result.interpretation && (
            <p className="text-xs text-primary mt-1 flex items-center gap-1">
              <span>🤖</span>
              <span>Có phân tích AI</span>
            </p>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      </div>
    </Card>
  );
};

export default ResultHistoryItem;
