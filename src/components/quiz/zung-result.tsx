import type { Result } from "@/@types/result";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getInterpretation, QUIZ_CODES } from "@/lib/score";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { Progress } from "../ui/progress";
import ResultBottomButton from "./result-bottom-button";
import { CheckCircle2, Sparkles } from "lucide-react";

const wellnessTips = [
  {
    title: "Thực hành chánh niệm",
    description: "Hãy thử thiền dẫn 5 phút để giúp ổn định cảm xúc.",
  },
  {
    title: "Thở sâu",
    description:
      "Hít vào 4 giây, giữ 4 giây và thở ra 6 giây. Lặp lại vài lần.",
  },
  {
    title: "Kết nối với thiên nhiên",
    description:
      "Một buổi dạo ngắn ngoài trời có thể giúp giảm căng thẳng và làm sáng tỏ tâm trí.",
  },
  {
    title: "Hạn chế caffeine",
    description:
      "Hãy cân nhắc giảm lượng caffeine — đôi khi có thể làm triệu chứng lo âu trầm trọng hơn.",
  },
];

const ZungResult = ({ result }: { result: Result }) => {
  const { currentQuiz } = useAppSelector((state) => state.quiz);
  const interpretation = getInterpretation(result.totalScore, QUIZ_CODES.ZUNG);
  const createdDate = result.createdAt
    ? dayjs(result.createdAt).format("MMM DD, YYYY")
    : "";

  const textColor = interpretation.color || "text-slate-400";
  const bgColor = textColor.replace("text-", "");
  const levelLabel = interpretation.level || result.level || "—";

  const progressPercentage = ((result.totalScore - 20) / (80 - 20)) * 100;

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-none gap-1">
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
        <CardContent className="space-y-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-5xl font-medium text-white">
                {result.totalScore}
                <span className="text-sm font-medium text-slate-500"> /80</span>
              </p>
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                  textColor,
                  `border-${bgColor}/50`
                )}
              >
                {levelLabel}
              </span>
            </div>

            <Progress
              value={progressPercentage}
              indicatorProps={{
                className: `bg-${bgColor}`,
              }}
            />
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {interpretation.description}
          </p>
        </CardContent>
      </Card>

      <Card className="border-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Sparkles className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-white">
                Gợi ý chăm sóc tâm lý
              </CardTitle>
              <CardDescription className="text-slate-400">
                Những bước nhỏ bạn có thể thử.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {wellnessTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white mb-1">
                  {tip.title}:
                </p>
                <p className="text-sm text-slate-400">{tip.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <ResultBottomButton
        needHelpFromPsychologist={interpretation.needHelpFromPsychologist}
      />
    </div>
  );
};

export default ZungResult;
