import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getChatSessions as getChatSessionsApi,
  createChatSession as createChatSessionApi,
  getChatSessionMessages as getChatSessionMessagesApi,
  createChatMessage as createChatMessageApi,
  deleteChatSession as deleteChatSessionApi,
  updateChatSession as updateChatSessionApi,
  analyzeSession as analyzeSessionApi,
  generateSummary as generateSummaryApi,
  addEmotionalFeedback as addEmotionalFeedbackApi,
  getEmotionalFeedback as getEmotionalFeedbackApi,
  getChatStats as getChatStatsApi,
} from "@/apis/chat";
import { ChatMessageRole, ChatSession } from "@/@types/chat";
import {
  ChatSessionStatus,
  ChatStats,
  EmotionalFeedback,
} from "@/@types/consultation";
import { aiClient } from "@/lib/ai";
import { Chat } from "@google/genai";
import { RootState } from "..";
import { AI_MODEL, AI_SYSTEM_INSTRUCTION } from "@/lib/constant";

interface ChatState {
  sessions: (ChatSession & { aiChatSession?: Chat | null })[];
  stats: ChatStats | null;
  currentFeedback: EmotionalFeedback | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  sessions: [],
  stats: null,
  currentFeedback: null,
  isLoading: false,
  error: null,
};

/* -------------------------------------------------------------------------- */
/*                               🔹 Thunks API                                */
/* -------------------------------------------------------------------------- */

export const updateChatSession = createAsyncThunk(
  "chat/updateChatSession",
  async (
    { sessionId, title }: { sessionId: number; title: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await updateChatSessionApi({ sessionId, title });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChatSessions = createAsyncThunk(
  "chat/fetchChatSessions",
  async ({ status }: { status?: ChatSessionStatus } = {}, { rejectWithValue }) => {
    try {
      const res = await getChatSessionsApi(status);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createChatSession = createAsyncThunk(
  "chat/createChatSession",
  async (
    { title, content }: { title: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const chatSession = aiClient.chats.create({
        model: AI_MODEL,
        history: [],
        config: {
          systemInstruction: AI_SYSTEM_INSTRUCTION,
        },
      });

      const result = await chatSession.sendMessage({ message: content });

      const res = await createChatSessionApi({
        title,
        content,
        modelContent: result.text || "",
      });

      return { ...res.data, aiChatSession: chatSession };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch chat messages for a session
export const fetchChatSessionMessages = createAsyncThunk(
  "chat/fetchChatSessionMessages",
  async (sessionId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const res = await getChatSessionMessagesApi(sessionId);
      const foundSession = state.chat.sessions.find((s) => s.id === sessionId);

      let chatSession: Chat | null = foundSession?.aiChatSession || null;

      if (!chatSession) {
        const history =
          res.data.messages?.map((msg) => ({
            role: msg.role === ChatMessageRole.USER ? "user" : "model",
            parts: [{ text: msg.content }],
          })) || [];

        chatSession = aiClient.chats.create({
          model: AI_MODEL,
          history,
          config: {
            systemInstruction: AI_SYSTEM_INSTRUCTION,
          },
        });
      }

      return { session: res.data, chatSession };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createChatMessage = createAsyncThunk(
  "chat/createChatMessage",
  async (
    { sessionId, content }: { sessionId: number; content: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const session = state.chat.sessions.find((s) => s.id === sessionId);
      if (!session) throw new Error("Chat session not found");
      if (!session.aiChatSession)
        throw new Error("AI chat session not initialized");

      const result = await session.aiChatSession.sendMessage({
        message: content,
      });

      const res = await createChatMessageApi({
        sessionId,
        content,
        modelContent: result.text || "",
      });

      return { messages: res.data, sessionId };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteChatSession = createAsyncThunk(
  "chat/deleteChatSession",
  async (sessionId: number, { rejectWithValue }) => {
    try {
      await deleteChatSessionApi(sessionId);
      return sessionId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const analyzeSession = createAsyncThunk(
  "chat/analyzeSession",
  async (sessionId: number, { rejectWithValue }) => {
    try {
      const res = await analyzeSessionApi(sessionId);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateSummary = createAsyncThunk(
  "chat/generateSummary",
  async (sessionId: number, { rejectWithValue }) => {
    try {
      const res = await generateSummaryApi(sessionId);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addEmotionalFeedback = createAsyncThunk(
  "chat/addEmotionalFeedback",
  async (
    {
      sessionId,
      data,
    }: {
      sessionId: number;
      data: { rating: number; feelingBetter?: boolean; comment?: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await addEmotionalFeedbackApi(sessionId, data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getEmotionalFeedback = createAsyncThunk(
  "chat/getEmotionalFeedback",
  async (sessionId: number, { rejectWithValue }) => {
    try {
      const res = await getEmotionalFeedbackApi(sessionId);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getChatStats = createAsyncThunk(
  "chat/getChatStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getChatStatsApi();
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/* -------------------------------------------------------------------------- */
/*                             🔹 Slice definition                            */
/* -------------------------------------------------------------------------- */

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetChatState: (state) => {
      state.sessions = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* ------------------------------ Update title ----------------------------- */
    builder
      .addCase(updateChatSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateChatSession.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.sessions.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) {
          state.sessions[idx] = {
            ...state.sessions[idx],
            title: action.payload.title,
          };
        }
      })
      .addCase(updateChatSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    /* ----------------------------- Fetch sessions ---------------------------- */
    builder
      .addCase(fetchChatSessions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchChatSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    /* ----------------------------- Create session ---------------------------- */
    builder
      .addCase(createChatSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createChatSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions.unshift(action.payload);
      })
      .addCase(createChatSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    /* --------------------------- Fetch session messages ---------------------- */
    builder
      .addCase(fetchChatSessionMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatSessionMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        const { session, chatSession } = action.payload;
        const idx = state.sessions.findIndex((s) => s.id === session.id);
        if (idx !== -1) {
          state.sessions[idx] = {
            ...session,
            aiChatSession: chatSession,
          };
        } else {
          state.sessions.push({ ...session, aiChatSession: chatSession });
        }
      })
      .addCase(fetchChatSessionMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    /* ----------------------------- Create message ---------------------------- */
    builder
      .addCase(createChatMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createChatMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const { messages, sessionId } = action.payload;
        const idx = state.sessions.findIndex((s) => s.id === sessionId);
        if (idx !== -1) {
          state.sessions[idx] = {
            ...state.sessions[idx],
            messages: [...(state.sessions[idx].messages || []), ...messages],
          };
        }
      })
      .addCase(createChatMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    /* ------------------------------ Delete session --------------------------- */
    builder
      .addCase(deleteChatSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteChatSession.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    /* ---------------------------- Analyze session ---------------------------- */
    builder
      .addCase(analyzeSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeSession.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.sessions.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) {
          state.sessions[idx] = {
            ...state.sessions[idx],
            ...action.payload,
          };
        }
      })
      .addCase(analyzeSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    /* --------------------------- Generate summary ---------------------------- */
    builder
      .addCase(generateSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.sessions.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) {
          state.sessions[idx] = {
            ...state.sessions[idx],
            ...action.payload,
          };
        }
      })
      .addCase(generateSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    /* ------------------------- Add emotional feedback ------------------------ */
    builder
      .addCase(addEmotionalFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addEmotionalFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentFeedback = action.payload;
      })
      .addCase(addEmotionalFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    /* ------------------------- Get emotional feedback ------------------------ */
    builder
      .addCase(getEmotionalFeedback.fulfilled, (state, action) => {
        state.currentFeedback = action.payload;
      })
      .addCase(getEmotionalFeedback.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    /* ------------------------------ Get stats ------------------------------- */
    builder
      .addCase(getChatStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(getChatStats.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetChatState } = chatSlice.actions;
export default chatSlice.reducer;
