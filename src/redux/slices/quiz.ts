import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Quiz,
  QuizResult,
  CreateQuizRequest,
  UpdateQuizRequest,
  SubmitQuizRequest,
  getQuizzes,
  getQuizById,
  createQuiz as createQuizApi,
  updateQuiz as updateQuizApi,
  deleteQuiz as deleteQuizApi,
  submitQuiz as submitQuizApi,
  getMyResults,
  getResultById,
  getQuizResults,
} from "@/apis/quiz";

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

export const createQuiz = createAsyncThunk(
  "quiz/createQuiz",
  async (quizData: CreateQuizRequest, { rejectWithValue }) => {
    try {
      const response = await createQuizApi(quizData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuiz = createAsyncThunk(
  "quiz/updateQuiz",
  async (
    { quizId, quizData }: { quizId: string; quizData: UpdateQuizRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateQuizApi(quizId, quizData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  "quiz/deleteQuiz",
  async (quizId: string, { rejectWithValue }) => {
    try {
      await deleteQuizApi(quizId);
      return quizId;
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

export const fetchMyResults = createAsyncThunk(
  "quiz/fetchMyResults",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await getMyResults(page, limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchResultById = createAsyncThunk(
  "quiz/fetchResultById",
  async (resultId: string, { rejectWithValue }) => {
    try {
      const response = await getResultById(resultId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchQuizResults = createAsyncThunk(
  "quiz/fetchQuizResults",
  async (
    {
      quizId,
      page = 1,
      limit = 10,
    }: { quizId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await getQuizResults(quizId, page, limit);
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

    // Create quiz
    builder
      .addCase(createQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quizzes.unshift(action.payload);
        state.currentQuiz = action.payload;
        state.error = null;
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update quiz
    builder
      .addCase(updateQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.quizzes.findIndex(
          (q) => q.id === action.payload.id
        );
        if (index !== -1) {
          state.quizzes[index] = action.payload;
        }
        if (state.currentQuiz?.id === action.payload.id) {
          state.currentQuiz = action.payload;
        }
        state.error = null;
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete quiz
    builder
      .addCase(deleteQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quizzes = state.quizzes.filter(
          (q) => q.id.toString() !== action.payload
        );
        if (state.currentQuiz?.id.toString() === action.payload) {
          state.currentQuiz = null;
        }
        state.error = null;
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
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

    // Fetch my results
    builder
      .addCase(fetchMyResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          totalPages: action.payload.pagination.totalPages,
          totalItems: action.payload.pagination.totalItems,
        };
        state.error = null;
      })
      .addCase(fetchMyResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch result by ID
    builder
      .addCase(fetchResultById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResultById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResult = action.payload;
        state.error = null;
      })
      .addCase(fetchResultById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch quiz results
    builder
      .addCase(fetchQuizResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          totalPages: action.payload.pagination.totalPages,
          totalItems: action.payload.pagination.totalItems,
        };
        state.error = null;
      })
      .addCase(fetchQuizResults.rejected, (state, action) => {
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
