// Định nghĩa kiểu dữ liệu cho phần diễn giải điểm số

import { ScoreInterpretation } from "@/@types/score";

export const ROUTE_PATHS = {
  HOME: "/home",
  CHAT: "/chat",
  CHAT_DETAIL: "/chat/:chatId",
  QUIZ: "/quiz",
  QUIZ_LIST: "/quiz/list",
  QUIZ_TAKE: "/quiz/take/:quizId",
  SETTINGS: "/settings",
  LOGIN: "/login",
  REGISTER: "/register",
  RESULT_HISTORY: "/result-history",
};

export const GET_ROUTE_PATHS = {
  QUIZ_TAKE: (quizId: number) => `/quiz/take/${quizId}`,
};

export const BDI_SCORE_INTERPRETATIONS: ScoreInterpretation[] = [
  {
    level: "Trầm cảm tối thiểu",
    range: [1, 10],
    description:
      "Điểm số của bạn cho thấy bạn có thể đang trải qua các triệu chứng trầm cảm ở mức tối thiểu. Hãy luôn quan tâm đến sức khỏe tinh thần của mình.",
    color: "text-green-600",
  },
  {
    level: "Trầm cảm nhẹ",
    range: [11, 16],
    description:
      "Điểm số của bạn nằm trong khoảng trầm cảm nhẹ. Bạn có thể thấy hữu ích khi chia sẻ cảm xúc của mình với người khác.",
    color: "text-yellow-600",
  },
  {
    level: "Trầm cảm trung bình",
    range: [17, 30],
    description:
      "Điểm số của bạn cho thấy bạn đang có các triệu chứng trầm cảm ở mức trung bình. Nên tìm đến sự hỗ trợ của chuyên gia sức khỏe tâm thần.",
    color: "text-orange-600",
  },
  {
    level: "Trầm cảm nặng",
    range: [31, 63],
    description:
      "Điểm số của bạn nằm trong mức trầm cảm nặng. Hãy tìm kiếm sự giúp đỡ chuyên môn ngay lập tức. Bạn không đơn độc — luôn có sự hỗ trợ dành cho bạn.",
    color: "text-red-600",
  },
];
