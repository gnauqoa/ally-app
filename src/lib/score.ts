import { ScoreInterpretation } from "@/@types/score";
import BDI from "@/assets/score/BDI.json";
import ZUNG from "@/assets/score/ZUNG.json";
import GRIT from "@/assets/score/GRIT.json";
import REID from "@/assets/score/REID1984.json";

const SCORE_INTERPRETATIONS = {
  BDI,
  ZUNG,
  GRIT,
  REID1984: REID,
};

// const DASS21_INTERPRETATIONS = DASS21;

// const HOLDAN_INTERPRETATIONS = HOLLAND;

export const getInterpretation = (
  score: number,
  code: string
): ScoreInterpretation => {
  const scoreInterpretation = SCORE_INTERPRETATIONS[
    code as keyof typeof SCORE_INTERPRETATIONS
  ].results.find((result) => {
    return score >= result.range[0] && score <= result.range[1];
  }) ?? {
    level: "",
    range: [0, 0],
    description: "",
    color: "text-slate-500",
  };

  return scoreInterpretation ?? SCORE_INTERPRETATIONS.BDI.results[0];
};
