import type { Result } from "@/@types/result";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import dayjs from "dayjs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ResultBottomButton from "@/components/quiz/result-bottom-button";
import { calculateHollandDimensions } from "@/lib/score";
import { useAppSelector } from "@/redux/hooks";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const MAX_SCORE_PER_DIMENSION = 14;

const HollandResult = ({ result }: { result: Result }) => {
  const { currentQuiz } = useAppSelector((state) => state.quiz);
  const dimensions = calculateHollandDimensions(result.resultJson);
  const maxScore = dimensions.reduce(
    (max, dimension) => Math.max(max, dimension.score),
    0
  );
  const chartData = dimensions.map((dimension) => ({
    name: dimension.name,
    label: dimension.name,
    score: dimension.score,
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
                {dayjs(result.createdAt).format("DD MMM, YYYY")}
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
                domain={[0, 14]}
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

          <div className="rounded-lg border border-white/5 bg-slate-950/30 p-4 text-sm text-slate-300 leading-relaxed">
            <p>
              Kết quả Holland thể hiện 6 nhóm sở thích nghề nghiệp RIASEC. Hãy
              ưu tiên những nhóm có điểm cao nhất để tìm kiếm ngành học và nghề
              nghiệp phù hợp.
            </p>
          </div>

          <div className="space-y-5">
            {dimensions.map((dimension) => {
              const pct = Math.round(
                (dimension.score / MAX_SCORE_PER_DIMENSION) * 100
              );

              return (
                <div
                  key={dimension.code}
                  className="rounded-xl border border-white/5 bg-slate-950/40 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Nhóm {dimension.code}
                      </p>
                      <p className="text-lg font-semibold">{dimension.name}</p>
                    </div>
                    <p className="text-2xl font-semibold text-white">
                      {dimension.score}
                      <span className="text-sm text-slate-500">
                        /{MAX_SCORE_PER_DIMENSION}
                      </span>
                    </p>
                  </div>

                  <Progress
                    value={pct}
                    className="mt-3"
                    indicatorProps={{ className: "bg-primary" }}
                  />

                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    {dimension.description}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <ResultBottomButton needHelpFromPsychologist={false} />
    </div>
  );
};

export default HollandResult;
