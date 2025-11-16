// Định nghĩa kiểu dữ liệu cho phần diễn giải điểm số
export const AI_MODEL = "gemini-2.5-flash-lite";
export const AI_SYSTEM_INSTRUCTION =
  "Bạn là một trợ lý tâm lý cá nhân hóa, có nhiệm vụ lắng nghe, thấu hiểu và đồng hành cùng người dùng. Hãy trả lời các câu hỏi, đưa ra hướng dẫn, và hỗ trợ chăm sóc tinh thần cho họ một cách nhẹ nhàng, tôn trọng và an toàn.";
export const ROUTE_PATHS = {
  HOME: "/home",
  
  // Chat
  CHAT: "/chat",
  NEW_CHAT: "/chat/new",
  CHAT_DETAIL: "/chat/:chatId",
  
  // Quiz/Assessment
  QUIZ: "/quiz",
  QUIZ_LIST: "/quiz/list",
  QUIZ_TAKE: "/quiz/take/:quizId",
  RESULT_HISTORY: "/result-history",
  RESULT_DETAIL: "/result-history/:resultId",
  
  // Journal
  JOURNAL: "/journal",
  JOURNAL_WRITE: "/journal/write",
  JOURNAL_VIEW: "/journal/view/:date",
  
  // Psychologist
  PSYCHOLOGIST_DASHBOARD: "/psychologist/dashboard",
  PSYCHOLOGIST_PATIENT: "/psychologist/patient/:patientId",
  FIND_PSYCHOLOGIST: "/find-psychologist",
  MY_PSYCHOLOGISTS: "/my-psychologists",
  
  // Appointments
  APPOINTMENTS: "/appointments",
  APPOINTMENT_SCHEDULE: "/appointments/schedule",
  
  // Resources
  RESOURCES: "/resources",
  SHARED_RESOURCES: "/shared-resources",
  
  // Settings
  SETTINGS: "/settings",
  
  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
};

export const GET_ROUTE_PATHS = {
  QUIZ_TAKE: (quizId: number) => `/quiz/take/${quizId}`,
  CHAT_DETAIL: (chatId: number | string) => `/chat/${chatId}`,
  JOURNAL_VIEW: (date: string) => `/journal/view/${date}`,
  PSYCHOLOGIST_PATIENT: (patientId: number) => `/psychologist/patient/${patientId}`,
  RESULT_DETAIL: (resultId: number | string) => `/result-history/${resultId}`,
};
