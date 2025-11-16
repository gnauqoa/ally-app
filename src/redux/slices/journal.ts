import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { journalApi } from '@/apis/journal';
import { Journal, JournalReminder, EmotionTrend, JournalStats, JournalStatus } from '@/@types/journal';

interface JournalState {
  journals: Journal[];
  currentJournal: Journal | null;
  emotionTrend: EmotionTrend[];
  stats: JournalStats | null;
  reminders: JournalReminder[];
  prompts: string[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: JournalState = {
  journals: [],
  currentJournal: null,
  emotionTrend: [],
  stats: null,
  reminders: [],
  prompts: [],
  total: 0,
  loading: false,
  error: null,
};

// Async thunks
export const fetchJournals = createAsyncThunk(
  'journal/fetchJournals',
  async (params?: { startDate?: string; endDate?: string; status?: string; limit?: number; offset?: number }) => {
    const response = await journalApi.getJournals(params);
    return response.data;
  }
);

export const fetchJournalByDate = createAsyncThunk(
  'journal/fetchJournalByDate',
  async (date: string) => {
    const response = await journalApi.getJournalByDate(date);
    return response.data;
  }
);

export const createJournal = createAsyncThunk(
  'journal/createJournal',
  async (data: {
    date: string;
    title?: string;
    content: string;
    wordCount?: number;
    writingDuration?: number;
    status?: JournalStatus;
  }) => {
    const response = await journalApi.createJournal(data);
    return response.data;
  }
);

export const updateJournal = createAsyncThunk(
  'journal/updateJournal',
  async ({ id, data }: { id: number; data: Partial<Journal> }) => {
    const response = await journalApi.updateJournal(id, data);
    return response.data;
  }
);

export const deleteJournal = createAsyncThunk(
  'journal/deleteJournal',
  async (id: number) => {
    await journalApi.deleteJournal(id);
    return id;
  }
);

export const analyzeJournal = createAsyncThunk(
  'journal/analyzeJournal',
  async (id: number) => {
    const response = await journalApi.analyzeJournal(id);
    return response.data;
  }
);

export const fetchEmotionTrend = createAsyncThunk(
  'journal/fetchEmotionTrend',
  async (days?: number) => {
    const response = await journalApi.getEmotionTrend(days);
    return response.data;
  }
);

export const fetchJournalStats = createAsyncThunk(
  'journal/fetchJournalStats',
  async () => {
    const response = await journalApi.getJournalStats();
    return response.data;
  }
);

export const generatePrompts = createAsyncThunk(
  'journal/generatePrompts',
  async () => {
    const response = await journalApi.generatePrompts();
    return response.data.prompts;
  }
);

export const fetchReminders = createAsyncThunk(
  'journal/fetchReminders',
  async () => {
    const response = await journalApi.getReminders();
    return response.data;
  }
);

export const upsertReminder = createAsyncThunk(
  'journal/upsertReminder',
  async (data: { time: string; enabled?: boolean; days: number[] }) => {
    const response = await journalApi.upsertReminder(data);
    return response.data;
  }
);

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    clearCurrentJournal: (state) => {
      state.currentJournal = null;
    },
    setCurrentJournal: (state, action: PayloadAction<Journal>) => {
      state.currentJournal = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch journals
    builder
      .addCase(fetchJournals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournals.fulfilled, (state, action) => {
        state.loading = false;
        state.journals = action.payload.journals;
        state.total = action.payload.total;
      })
      .addCase(fetchJournals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch journals';
      });

    // Fetch journal by date
    builder
      .addCase(fetchJournalByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournalByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJournal = action.payload;
      })
      .addCase(fetchJournalByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch journal';
      });

    // Create journal
    builder
      .addCase(createJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.journals.unshift(action.payload);
        state.currentJournal = action.payload;
      })
      .addCase(createJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create journal';
      });

    // Update journal
    builder
      .addCase(updateJournal.fulfilled, (state, action) => {
        const index = state.journals.findIndex((j) => j.id === action.payload.id);
        if (index !== -1) {
          state.journals[index] = action.payload;
        }
        if (state.currentJournal?.id === action.payload.id) {
          state.currentJournal = action.payload;
        }
      });

    // Delete journal
    builder
      .addCase(deleteJournal.fulfilled, (state, action) => {
        state.journals = state.journals.filter((j) => j.id !== action.payload);
        if (state.currentJournal?.id === action.payload) {
          state.currentJournal = null;
        }
      });

    // Analyze journal
    builder
      .addCase(analyzeJournal.pending, (state) => {
        state.loading = true;
      })
      .addCase(analyzeJournal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.journals.findIndex((j) => j.id === action.payload.id);
        if (index !== -1) {
          state.journals[index] = action.payload;
        }
        if (state.currentJournal?.id === action.payload.id) {
          state.currentJournal = action.payload;
        }
      })
      .addCase(analyzeJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to analyze journal';
      });

    // Fetch emotion trend
    builder
      .addCase(fetchEmotionTrend.fulfilled, (state, action) => {
        state.emotionTrend = action.payload;
      });

    // Fetch stats
    builder
      .addCase(fetchJournalStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });

    // Generate prompts
    builder
      .addCase(generatePrompts.fulfilled, (state, action) => {
        state.prompts = action.payload;
      });

    // Fetch reminders
    builder
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.reminders = action.payload;
      });

    // Upsert reminder
    builder
      .addCase(upsertReminder.fulfilled, (state, action) => {
        const index = state.reminders.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.reminders[index] = action.payload;
        } else {
          state.reminders.push(action.payload);
        }
      });
  },
});

export const { clearCurrentJournal, setCurrentJournal, clearError } = journalSlice.actions;
export default journalSlice.reducer;

