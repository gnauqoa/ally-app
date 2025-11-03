import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getQuizzes,
  getQuizById,
  submitQuiz as submitQuizApi,
} from "@/apis/quiz";

import { Quiz, QuizResult, SubmitQuizRequest } from "@/@types/quiz";

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  results: QuizResult[];
  currentResult: QuizResult | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  results: [],
  currentResult: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 0,
    totalItems: 0,
  },
};

// Async thunks
export const fetchQuizzes = createAsyncThunk(
  "quiz/fetchQuizzes",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await getQuizzes(page, limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchQuizById = createAsyncThunk(
  "quiz/fetchQuizById",
  async (quizId: string, { rejectWithValue }) => {
    try {
      const response = await getQuizById(quizId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitQuiz = createAsyncThunk(
  "quiz/submitQuiz",
  async (data: SubmitQuizRequest, { rejectWithValue }) => {
    try {
      const response = await submitQuizApi(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
    },
    clearCurrentResult: (state) => {
      state.currentResult = null;
    },
    resetQuizState: (state) => {
      state.quizzes = [];
      state.currentQuiz = null;
      state.results = [];
      state.currentResult = null;
      state.error = null;
      state.pagination = {
        page: 1,
        limit: 10,
        totalPages: 0,
        totalItems: 0,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch quizzes
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quizzes = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          totalPages: action.payload.pagination.totalPages,
          totalItems: action.payload.pagination.totalItems,
        };
        state.error = null;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch quiz by ID
    builder
      .addCase(fetchQuizById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuiz = action.payload;
        state.error = null;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Submit quiz
    builder
      .addCase(submitQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResult = action.payload;
        state.results.unshift(action.payload);
        state.error = null;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearCurrentQuiz,
  clearCurrentResult,
  resetQuizState,
} = quizSlice.actions;
export default quizSlice.reducer;
