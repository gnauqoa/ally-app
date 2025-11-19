import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  searchPsychologists,
  getMyPsychologists,
  connectToPsychologist,
  updateRelationshipStatus,
  updatePermissions,
} from "@/apis/psychologist";
import {
  Psychologist,
  PatientPsychologist,
  RelationshipStatus,
} from "@/@types/psychologist";

interface PatientPsychologistState {
  psychologists: Psychologist[];
  myPsychologists: PatientPsychologist[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: PatientPsychologistState = {
  psychologists: [],
  myPsychologists: [],
  isLoading: false,
  error: null,
  searchQuery: "",
};

// Async thunks
export const searchForPsychologists = createAsyncThunk(
  "patientPsychologist/search",
  async (
    params: {
      search?: string;
      specialization?: string;
      verified?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await searchPsychologists(params);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMyPsychologists = createAsyncThunk(
  "patientPsychologist/fetchMy",
  async ({ status }: { status?: RelationshipStatus }, { rejectWithValue }) => {
    try {
      const res = await getMyPsychologists(status);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const requestConnection = createAsyncThunk(
  "patientPsychologist/connect",
  async (psychologistId: number, { rejectWithValue }) => {
    try {
      const res = await connectToPsychologist(psychologistId);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateConnection = createAsyncThunk(
  "patientPsychologist/updateStatus",
  async (
    { relationshipId, status }: { relationshipId: number; status: RelationshipStatus },
    { rejectWithValue }
  ) => {
    try {
      const res = await updateRelationshipStatus(relationshipId, status);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDataPermissions = createAsyncThunk(
  "patientPsychologist/updatePermissions",
  async (
    {
      relationshipId,
      permissions,
    }: {
      relationshipId: number;
      permissions: {
        canViewJournals?: boolean;
        canViewChats?: boolean;
        canViewAssessments?: boolean;
        shareAll?: boolean;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await updatePermissions(relationshipId, permissions);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const patientPsychologistSlice = createSlice({
  name: "patientPsychologist",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Search psychologists
    builder
      .addCase(searchForPsychologists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchForPsychologists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.psychologists = action.payload.psychologists;
      })
      .addCase(searchForPsychologists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch my psychologists
    builder
      .addCase(fetchMyPsychologists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyPsychologists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myPsychologists = action.payload;
      })
      .addCase(fetchMyPsychologists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Request connection
    builder
      .addCase(requestConnection.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestConnection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myPsychologists.unshift(action.payload);
      })
      .addCase(requestConnection.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update connection
    builder
      .addCase(updateConnection.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateConnection.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.myPsychologists.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.myPsychologists[index] = action.payload;
        }
      })
      .addCase(updateConnection.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update permissions
    builder
      .addCase(updateDataPermissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDataPermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.myPsychologists.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.myPsychologists[index] = action.payload;
        }
      })
      .addCase(updateDataPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSearchQuery } = patientPsychologistSlice.actions;
export default patientPsychologistSlice.reducer;

