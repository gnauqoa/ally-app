import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyResults, getResultById } from "@/apis/result";
import { Result } from "@/@types/result";

interface ResultState {
  results: Result[];
  currentResult: Result | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

const initialState: ResultState = {
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

export const fetchMyResults = createAsyncThunk(
  "result/fetchMyResults",
  async (
    { page = 1, limit = 10, code = "" }: { page?: number; limit?: number, code?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await getMyResults(page, limit, code);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchResultById = createAsyncThunk(
  "result/fetchResultById",
  async (resultId: string, { rejectWithValue }) => {
    try {
      const response = await getResultById(resultId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentResult: (state) => {
      state.currentResult = null;
    },
    resetResultState: (state) => {
      state.results = [];
      state.currentResult = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
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
  },
});

export const { clearError, clearCurrentResult, resetResultState } =
  resultSlice.actions;
export default resultSlice.reducer;

