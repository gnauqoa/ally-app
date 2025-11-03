import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import quizReducer from "./slices/quiz";
import resultReducer from "./slices/result";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    result: resultReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["auth/login/fulfilled", "auth/register/fulfilled"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

