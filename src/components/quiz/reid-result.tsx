import type { Result } from "@/@types/result";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ResultBottomButton from "@/components/quiz/result-bottom-button";
import { calculateReidSubscales } from "@/lib/score";
import { useAppSelector } from "@/redux/hooks";
import dayjs from "dayjs";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const MAX_SCORE = 25;

const ReidResult = ({ result }: { result: Result }) => {
  const { currentQuiz } = useAppSelector((state) => state.quiz);
  const assessment = calculateReidSubscales(result.resultJson);

  const chartData = assessment.map((subscale) => ({
    name: subscale.name,
    score: subscale.score,
  }));

  const chartConfig = {
    score: {
      label: "Điểm",
      color: "var(--primary)",
    },
  } satisfies ChartConfig;
  return (
    <div className="flex flex-col gap-6 pb-6">
      <Card className="border-none text-white shadow-xl gap-0">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
            <CardTitle className="text-base font-medium text-white">
              {currentQuiz?.name}
            </CardTitle>

            {result.createdAt && (
              <span className="text-xs text-slate-500 text-nowrap">
                {dayjs(result.createdAt).format("MMM DD, YYYY")}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RadarChart data={chartData}>
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis
                dataKey="name"
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              />

              <PolarRadiusAxis
                angle={30}
                domain={[0, MAX_SCORE]}
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

              <Radar
                dataKey="score"
                fill="var(--primary)"
                fillOpacity={0.6}
                dot={{
                  r: 4,
                  fillOpacity: 1,
                }}
              />
            </RadarChart>
          </ChartContainer>

          {/* --- Score & Interpretation Section --- */}
          {assessment.map((subscale) => {
            const pct = Math.round((subscale.score / MAX_SCORE) * 100);

            return (
              <div key={subscale.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    {subscale.name}
                  </span>
                  <p className="text-2xl font-medium">
                    {subscale.score}
                    <span className="text-sm text-slate-500">/{MAX_SCORE}</span>
                  </p>
                </div>

                <Progress
                  value={pct}
                  indicatorProps={{
                    className: `bg-${subscale.color}`,
                  }}
                />

                <p className="text-xs text-slate-400 leading-relaxed">
                  {subscale.description}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <ResultBottomButton needHelpFromPsychologist={false} />
    </div>
  );
};

export default ReidResult;
