import type { Result } from "@/@types/result";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateGritSubscales } from "@/lib/score";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { Progress } from "../ui/progress";
import ResultBottomButton from "./result-bottom-button";

const GritResult = ({ result }: { result: Result }) => {
  const { currentQuiz } = useAppSelector((state) => state.quiz);
  const assessmentResult = calculateGritSubscales(result.resultJson);
  const createdDate = result.createdAt
    ? dayjs(result.createdAt).format("MMM DD, YYYY")
    : "";

  const { totalScore, interpretation, subscales } = assessmentResult;
  const MAX_SCORE = 5.0;

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
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-medium text-white">
                {totalScore.toFixed(1)}
              </span>
              <span className="text-sm font-medium text-slate-500">
                /{MAX_SCORE}
              </span>
            </div>
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                `text-${interpretation.color}`,
                `border-${interpretation.color}/50`
              )}
            >
              {interpretation.level}
            </span>
          </div>

          <Progress
            value={(totalScore / MAX_SCORE) * 100}
            indicatorProps={{
              className: `bg-${interpretation.color}`,
            }}
          />

          <p className="text-sm text-slate-300 leading-relaxed">
            {interpretation.description}
          </p>
        </CardContent>
      </Card>

      {subscales?.map((subscale, index) => {
        return (
          <Card key={index} className="border-none gap-0">
            <CardHeader className="pb-2 w-full">
              <div className="flex flex-row items-center ">
                <CardTitle className="text-sm font-medium text-white">
                  {subscale.name}
                </CardTitle>
                <span className="ml-auto text-sm font-medium">
                  {subscale.score.toFixed(1)}
                  <span className="text-slate-500">/{MAX_SCORE}</span>
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress
                value={(subscale.score / MAX_SCORE) * 100}
                indicatorProps={{
                  className: `bg-${interpretation.color}`,
                }}
              />
              <p className="text-xs text-slate-400 leading-relaxed">
                {subscale.description}
              </p>
            </CardContent>
          </Card>
        );
      })}

      <ResultBottomButton
        needHelpFromPsychologist={interpretation.needHelpFromPsychologist}
      />
    </div>
  );
};

export default GritResult;
