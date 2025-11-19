import type { Result } from "@/@types/result";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getInterpretation, QUIZ_CODES } from "@/lib/score";
import dayjs from "dayjs";
import { Frown, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { Separator } from "../ui/separator";
import { useIonRouter } from "@ionic/react";
import { ROUTE_PATHS } from "@/lib/constant";
import ResultBottomButton from "./result-bottom-button";

const BDIResult = ({ result }: { result: Result }) => {
  const { currentQuiz } = useAppSelector((state) => state.quiz);
  const router = useIonRouter();
  const interpretation = getInterpretation(result.totalScore, QUIZ_CODES.BDI);
  const createdDate = result.createdAt
    ? dayjs(result.createdAt).format("MMM DD, YYYY")
    : "";

  const accentColor = interpretation.color ?? "text-slate-400";
  const levelLabel = interpretation.level || result.level || "—";

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-none">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
            <CardTitle className="text-base font-medium text-white">
              {currentQuiz?.name}
            </CardTitle>
            {createdDate && (
              <span className="text-xs text-slate-500">{createdDate}</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className={cn("rounded-full border p-4", accentColor)}>
              <Frown className="h-10 w-10" />
            </div>
            <div className="text-[56px] font-semibold leading-none tracking-tight">
              {result.totalScore}
            </div>
            <div
              className={cn(
                "rounded-full border border-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider",
                accentColor
              )}
            >
              {levelLabel}
            </div>
            <Separator className="mt-4 bg-primary" />
            <p className="text-sm text-slate-400 max-w-md">
              {interpretation.description}
            </p>
          </div>
        </CardContent>
      </Card>
      <Button
        variant="outline"
        color="primary"
        className="w-full justify-between border-none"
      >
        Xem chi tiết cách tính điểm
        <ChevronDown className="h-5 w-5 text-slate-500" />
      </Button>
      <Card className="border-none gap-1">
        <CardHeader>
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-primary">
              <ArrowRight className="h-4 w-4" />
            </span>
            Bước tiếp theo
          </div>
          <CardDescription className="text-slate-400 py-0">
            Dựa trên kết quả, chúng tôi gợi ý bạn nên thực hành tự chăm sóc bản
            thân và viết nhật ký. Đặc biệt, chúng tôi khuyên bạn nên tham vấn ý
            kiến chuyên gia để chia sẻ kỹ hơn về cảm xúc của mình.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="link" className="px-0 py-0 text-primary">
            Tìm hiểu thêm
          </Button>
        </CardContent>
      </Card>
      <ResultBottomButton needHelpFromPsychologist={interpretation.needHelpFromPsychologist} />
    </div>
  );
};

export default BDIResult;
