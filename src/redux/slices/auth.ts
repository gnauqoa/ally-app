import { AuthState, LoginRequest, RegisterRequest, User } from "@/@types/auth";
import {
  clearAuth,
  getAuthState,
  getRefreshToken,
  saveAuthState,
} from "@/lib/auth-storage";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { login, register, getProfile, logout } from "@/apis/auth";

// Load initial state from storage
const storedAuthState = getAuthState();
const initialState: AuthState = {
  user: storedAuthState.user,
  token: storedAuthState.token,
  isAuthenticated: storedAuthState.isAuthenticated,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      saveAuthState(
        response.data.user,
        response.data.tokens.access.token,
        response.data.tokens.refresh.token
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await register(userData);
      saveAuthState(
        response.data.user,
        response.data.tokens.access.token,
        response.data.tokens.refresh.token
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getProfileThunk = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const user = await getProfile();
      return user.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return rejectWithValue("No refresh token found");
    }
    await logout({ refreshToken });
    clearAuth();
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Persist to sage
      setUser(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    restoreAuthState: (state) => {
      // Restore from storage
      const storedState = getAuthState();
      state.user = storedState.user;
      state.token = storedState.token;
      state.isAuthenticated = storedState.isAuthenticated;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.tokens.access.token;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.tokens.access.token;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });

    // Get current user
    builder
      .addCase(getProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { setUser, clearError, restoreAuthState } = authSlice.actions;
export default authSlice.reducer;
