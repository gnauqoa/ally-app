import { BDI_SCORE_INTERPRETATIONS } from "./constant";
import { ScoreInterpretation } from "@/@types/score";

export const getInterpretation = (score: number): ScoreInterpretation => {
  if (score >= 1 && score <= 10) return BDI_SCORE_INTERPRETATIONS[0];
  if (score >= 11 && score <= 16) return BDI_SCORE_INTERPRETATIONS[1];
  if (score >= 17 && score <= 30) return BDI_SCORE_INTERPRETATIONS[2];
  if (score >= 31) return BDI_SCORE_INTERPRETATIONS[3];
  return {
    level: "Không có triệu chứng",
    range: [0, 0],
    description:
      "Điểm số của bạn cho thấy không có triệu chứng trầm cảm đáng kể.",
    color: "text-slate-600",
  };
};
