import {
  ScoreInterpretation,
  AssessmentResult,
  DASS21SubscaleResult,
} from "@/@types/score";
import BDI from "@/assets/score/BDI.json";
import ZUNG from "@/assets/score/ZUNG.json";
import GRIT from "@/assets/score/GRIT.json";
import REID from "@/assets/score/REID1984.json";
import DASS21 from "@/assets/score/DASS21.json";
import HOLLAND from "@/assets/score/HOLLAND.json";
import { ResultJson } from "@/@types/result";

export const QUIZ_CODES = {
  BDI: "BDI",
  ZUNG: "ZUNG",
  GRIT: "GRIT",
  REID1984: "REID1984",
  DASS21: "DASS21",
  HOLLAND: "HOLLAND",
};

const SCORE_INTERPRETATIONS = {
  [QUIZ_CODES.BDI]: BDI,
  [QUIZ_CODES.ZUNG]: ZUNG,
  [QUIZ_CODES.GRIT]: GRIT,
};

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
    color: "slate-500",
  };

  return scoreInterpretation as ScoreInterpretation;
};

export const getColorForLevel = (level: string): string => {
  switch (level) {
    case "NORMAL":
      return "green-600";
    case "MILD":
      return "yellow-600";
    case "MODERATE":
      return "orange-600";
    case "SEVERE":
      return "red-600";
    case "EXTREMELY_SEVERE":
      return "red-800";
    default:
      return "slate-500";
  }
};

/**
 * Calculate DASS-21 subscale scores
 * DASS-21 has three subscales: Depression, Anxiety, and Stress
 * Each subscale score is multiplied by 2
 */
export const calculateDASS21Subscales = (
  answers: ResultJson[]
): DASS21SubscaleResult => {
  // Calculate raw scores for each subscale
  const rawScores = {
    depression: DASS21.scoring.subscales.depression.questions.reduce(
      (sum, index) => sum + (answers[index - 1].score || 0),
      0
    ),
    anxiety: DASS21.scoring.subscales.anxiety.questions.reduce(
      (sum, index) => sum + (answers[index - 1].score || 0),
      0
    ),
    stress: DASS21.scoring.subscales.stress.questions.reduce(
      (sum, index) => sum + (answers[index - 1].score || 0),
      0
    ),
  };

  const depressionInterpretation =
    DASS21.scoring.subscales.depression.ranges.find(
      (range) =>
        rawScores.depression >= range.min && rawScores.depression <= range.max
    ) || DASS21.scoring.subscales.depression.ranges[0];
  const anxietyInterpretation =
    DASS21.scoring.subscales.anxiety.ranges.find(
      (range) =>
        rawScores.anxiety >= range.min && rawScores.anxiety <= range.max
    ) || DASS21.scoring.subscales.anxiety.ranges[0];
  const stressInterpretation =
    DASS21.scoring.subscales.stress.ranges.find(
      (range) => rawScores.stress >= range.min && rawScores.stress <= range.max
    ) || DASS21.scoring.subscales.stress.ranges[0];

  return {
    depression: {
      name: "Trầm cảm",
      label: depressionInterpretation.label,
      level: depressionInterpretation.level,
      score: rawScores.depression,
      description: depressionInterpretation.description,
      needHelpFromPsychologist:
        depressionInterpretation.needHelpFromPsychologist,
      range: [depressionInterpretation.min, depressionInterpretation.max],
    },
    anxiety: {
      name: "Lo âu",
      label: anxietyInterpretation.label,
      level: anxietyInterpretation.level,
      score: rawScores.anxiety,
      description: anxietyInterpretation.description,
      needHelpFromPsychologist: anxietyInterpretation.needHelpFromPsychologist,
      range: [anxietyInterpretation.min, anxietyInterpretation.max],
    },
    stress: {
      name: "Căng thẳng",
      label: stressInterpretation.label,
      level: stressInterpretation.level,
      score: rawScores.stress,
      description: stressInterpretation.description,
      needHelpFromPsychologist: stressInterpretation.needHelpFromPsychologist,
      range: [stressInterpretation.min, stressInterpretation.max],
    },
  };
};

/**
 * Calculate Grit subscale scores
 * Grit has two subscales: Perseverance of Effort and Consistency of Interest
 */
export const calculateGritSubscales = (
  answers: ResultJson[]
): AssessmentResult => {
  const subscaleQuestions = {
    perseverance: [1, 4, 6, 9, 10, 12],
    consistency: [2, 3, 5, 7, 8, 11],
  };

  // Calculate average for each subscale
  const perseveranceScore =
    subscaleQuestions.perseverance.reduce(
      (sum, q) => sum + (answers[q - 1].score || 0),
      0
    ) / subscaleQuestions.perseverance.length;
  const consistencyScore =
    subscaleQuestions.consistency.reduce(
      (sum, q) => sum + (answers[q - 1].score || 0),
      0
    ) / subscaleQuestions.consistency.length;

  // Total Grit score (average of all 12 questions)
  const totalScore =
    (perseveranceScore * subscaleQuestions.perseverance.length +
      consistencyScore * subscaleQuestions.consistency.length) /
    12;

  // Get interpretation for total score
  const totalInterpretation =
    GRIT.results.find(
      (result) => totalScore >= result.range[0] && totalScore <= result.range[1]
    ) || GRIT.results[0];

  const subscales = [
    {
      name: "Sự kiên trì",
      description:
        "Đo lường khả năng vượt qua khó khăn và hoàn thành những gì bạn đã bắt đầu.",
      score: perseveranceScore,
    },
    {
      name: "Sự duy trì hứng thú",
      description:
        "Phản ánh xu hướng duy trì sự tập trung vào các mục tiêu trong thời gian dài.",
      score: consistencyScore,
    },
  ];

  return {
    totalScore: Math.round(totalScore * 100) / 100,
    interpretation: totalInterpretation,
    subscales,
  };
};

/**
 * Calculate Holland Career Interest dimensions
 * Holland RIASEC has 6 dimensions based on question prefixes
 */
export const calculateHollandDimensions = (
  answers: ResultJson[]
): {
  name: string;
  code: string;
  score: number;
  description: string;
}[] => {
  const dimensions = [
    {
      name: "Kỹ thuật",
      questions: Array.from({ length: 14 }, (_, i) => i + 1),
      code: "A",
      description:
        "Yếu tố di truyền và kinh nghiệm của nhóm Kỹ thuật dẫn đến sự ưu tiên cho các hoạt động đòi hỏi sự tương tác với các đồ vật, công cụ, máy móc và động vật một cách rõ ràng, có trật tự hoặc có hệ thống. Nhóm này không có thiện cảm với các hoạt động giáo dục hoặc trị liệu. Những khuynh hướng hành vi này dẫn đến việc thu được các năng lực thủ công, cơ khí, nông nghiệp, điện và kỹ thuật và thiếu hụt các năng lực xã hội và giáo dục.",
    },
    {
      name: "Nghiên cứu",
      questions: Array.from({ length: 14 }, (_, i) => i + 15),
      code: "B",
      description:
        "Yếu tố di truyền và kinh nghiệm của nhóm Nghiên cứu dẫn đến việc ưu tiên cho các hoạt động đòi hỏi sự điều tra các hiện tượng vật lý, sinh học và văn hóa theo phương pháp quan sát, tượng trưng, có hệ thống và sáng tạo để hiểu và kiểm soát các hiện tượng đó. Nhóm này không có thiện cảm với các hoạt động thuyết phục, giao tiếp và lặp đi lặp lại. Những khuynh hướng hành vi này dẫn đến việc thu được các năng lực khoa học và toán học và thâm hụt các năng lực thuyết phục.",
    },
    {
      name: "Nghệ thuật",
      questions: Array.from({ length: 14 }, (_, i) => i + 29),
      code: "C",
      description:
        "Yếu tố di truyền và kinh nghiệm của nhóm Nghệ thuật dẫn đến việc ưu tiên cho các hoạt động chưa rõ ràng, tự do, chưa được hệ thống hóa. Các hoạt động này đòi hỏi sự vận dụng các vật liệu vật lý, qua ngôn ngữ nói, hoặc liên quan đến con người để tạo ra các hình thức hoặc sản phẩm nghệ thuật. Nhóm này không có thiện cảm với các hoạt động rõ ràng, có hệ thống và theo yêu cầu. Những khuynh hướng hành vi trên dẫn đến việc thu được các năng lực nghệ thuật - ngôn ngữ, nghệ thuật, âm nhạc, kịch, viết - và sự thiếu hụt trong năng lực thuộc về hành chính hoặc hệ thống kinh doanh.",
    },
    {
      name: "Xã hội",
      questions: Array.from({ length: 14 }, (_, i) => i + 43),
      code: "D",
      description:
        "Yếu tố di truyền và kinh nghiệm của nhóm Xã hội dẫn đến việc ưu tiên cho các hoạt động đòi hỏi làm việc với người khác để thông báo, huấn luyện, phát triển, chữa lành hoặc giác ngộ. Nhóm này không có thiện cảm với các hoạt động rõ ràng, có trật tự, có hệ thống liên quan đến vật liệu, công cụ hoặc máy móc. Những khuynh hướng hành vi này dẫn đến việc thu được các khả năng liên quan đến con người như năng lực giao tiếp giữa các cá nhân và năng lực liên quan đến giáo dục – cũng như sự thiếu hụt các năng lực thuộc về thủ công và kỹ thuật.",
    },
    {
      name: "Quản lý",
      questions: Array.from({ length: 14 }, (_, i) => i + 57),
      code: "E",
      description:
        "Yếu tố di truyền và kinh nghiệm của nhóm Quản lý dẫn đến sự ưu tiên cho các hoạt động đòi hỏi sự ảnh hưởng và chi phối lên người khác để đạt được các mục tiêu của tổ chức hoặc lợi ích kinh tế. Nhóm này không có thiện cảm với các hoạt động quan sát, tượng trưng và hệ thống. Những khuynh hướng hành vi này dẫn đến việc thu được các năng lực lãnh đạo, giao tiếp giữa các cá nhân và thuyết phục cũng như sự thiếu hụt các năng lực khoa học.",
    },
    {
      name: "Nghiệp vụ",
      questions: Array.from({ length: 14 }, (_, i) => i + 71),
      code: "F",
      description:
        "Yếu tố di truyền và kinh nghiệm của nhóm Nghiệp vụ dẫn đến sự ưu tiên cho các hoạt động đòi hỏi phải xử lý dữ liệu rõ ràng, có trật tự, có hệ thống. Ví dụ cụ thể là việc lưu giữ hồ sơ, lưu trữ tài liệu, sao chép tài liệu, sắp xếp dữ liệu văn bản và dữ liệu số theo kế hoạch quy định, điều hành máy kinh doanh cũng như máy xử lý dữ liệu để đạt được các mục tiêu kinh tế hoặc mục tiêu tổ chức. Nhóm này không có thiện cảm với các hoạt động mơ hồ, tự do, thăm dò hoặc không hệ thống hóa.",
    },
  ];

  return dimensions
    .map((dimension) => {
      const score = dimension.questions.reduce((sum, q) => {
        return sum + (answers[q - 1].score || 0);
      }, 0);

      return {
        name: dimension.name,
        code: dimension.code,
        score,
        description: dimension.description,
      };
    })
    .sort((a, b) => b.score - a.score);
};

/**
 * Calculate Reid Learning Style subscales
 * Reid has 6 learning style subscales
 */
export const calculateReidSubscales = (
  answers: ResultJson[]
): {
  name: string;
  score: number;
  description: string;
  color: string;
  type: string;
}[] => {
  const subscaleNames = [
    {
      name: "Xúc giác",
      questions: [1, 2, 3, 4, 5],
      type: "tactile",
    },
    {
      name: "Thính giác",
      questions: [6, 7, 8, 9, 10],
      type: "auditory",
    },
    {
      name: "Học nhóm",
      questions: [11, 12, 13, 14, 15],
      type: "group",
    },
    {
      name: "Học cá nhân",
      questions: [16, 17, 18, 19, 20],
      type: "individual",
    },
    {
      name: "Vận động",
      questions: [21, 22, 23, 24, 25],
      type: "kinesthetic",
    },
    {
      name: "Thị giác",
      questions: [26, 27, 28, 29, 30],
      type: "visual",
    },
  ];

  const subscales = subscaleNames
    .map((subscale) => {
      const score = subscale.questions.reduce((sum, q) => {
        return sum + (answers[q - 1].score || 0);
      }, 0);
      const interpretation = REID.results.find(
        (r) => r.range[0] <= score && r.range[1] >= score
      );
      return {
        ...subscale,
        score,
        type: subscale.type,
        color: interpretation?.color || "slate-500",
        description: interpretation?.description || "",
      };
    })
    .sort((a, b) => b.score - a.score);

  return subscales;
};
