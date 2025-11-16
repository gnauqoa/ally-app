import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import quizReducer from "./slices/quiz";
import resultReducer from "./slices/result";
import chatReducer from "./slices/chat";
import journalReducer from "./slices/journal";
import psychologistReducer from "./slices/psychologist";
import patientPsychologistReducer from "./slices/patient-psychologist";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    result: resultReducer,
    chat: chatReducer,
    journal: journalReducer,
    psychologist: psychologistReducer,
    patientPsychologist: patientPsychologistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
