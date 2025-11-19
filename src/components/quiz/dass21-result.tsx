import DASS21 from "@/assets/score/DASS21.json";
import type { Result } from "@/@types/result";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { calculateDASS21Subscales, getColorForLevel } from "@/lib/score";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
import { useAppSelector } from "@/redux/hooks";
import ResultBottomButton from "./result-bottom-button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { ChevronDownIcon } from "lucide-react";

const DASS21Result = ({ result }: { result: Result }) => {
  const assessmentResult = calculateDASS21Subscales(result.resultJson);
  const { currentQuiz } = useAppSelector((state) => state.quiz);

  const subscales = Object.entries(assessmentResult).map(([key, value]) => ({
    ...value,
    key,
  }));

  const needHelpFromPsychologist =
    assessmentResult.depression.needHelpFromPsychologist ||
    assessmentResult.anxiety.needHelpFromPsychologist ||
    assessmentResult.stress.needHelpFromPsychologist;

  const createdDate = result.createdAt
    ? dayjs(result.createdAt).format("MMM DD, YYYY")
    : "";

  const MAX_SCORE = 42;

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-none">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
            <CardTitle className="text-base font-medium text-white">
              {currentQuiz?.name}
            </CardTitle>
            {createdDate && (
              <span className="text-xs text-slate-500 text-nowrap">
                {createdDate}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {subscales.map((s) => {
            const percent = (s.score / MAX_SCORE) * 100;
            const color = getColorForLevel(s.level);

            return (
              <div key={`score-${s.key}`} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    {s.name}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">
                      {s.score}
                    </span>

                    <span
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                        `text-${color}`
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                </div>

                <Progress
                  value={percent}
                  indicatorProps={{
                    className: `bg-${color}`,
                  }}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-none gap-3">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-white">
            Hiểu về kết quả của bạn
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {subscales.map((ss) => {
            const color = getColorForLevel(ss.level);
            return (
              <Card key={`${ss.key}-${ss.level}`} className={cn("px-0 gap-2 py-4", `border-${color}`)}>
                <CardHeader>
                  <CardTitle className={`text-${color}`}>
                    {`${ss.label} (${ss.range[0]}-${ss.range[1]})`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{ss.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      <ResultBottomButton needHelpFromPsychologist={needHelpFromPsychologist} />
    </div>
  );
};

export default DASS21Result;
