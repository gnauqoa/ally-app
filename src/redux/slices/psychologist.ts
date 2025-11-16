import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProfile,
  upsertProfile,
  getMyPatients,
  createNote as createNoteApi,
  getPatientNotes,
  createTreatmentPlan as createTreatmentPlanApi,
  updateTreatmentPlan as updateTreatmentPlanApi,
  getPatientTreatmentPlans,
} from "@/apis/psychologist";
import {
  Psychologist,
  PatientPsychologist,
  PsychologistNote,
  TreatmentPlan,
} from "@/@types/psychologist";

interface PsychologistState {
  profile: Psychologist | null;
  patients: PatientPsychologist[];
  currentPatientNotes: PsychologistNote[];
  currentPatientPlans: TreatmentPlan[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PsychologistState = {
  profile: null,
  patients: [],
  currentPatientNotes: [],
  currentPatientPlans: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchPsychologistProfile = createAsyncThunk(
  "psychologist/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProfile();
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "psychologist/updateProfile",
  async (data: {
    specialization?: string;
    licenseNumber?: string;
    bio?: string;
    education?: string;
    experience?: number;
  }, { rejectWithValue }) => {
    try {
      const res = await upsertProfile(data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMyPatients = createAsyncThunk(
  "psychologist/fetchPatients",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyPatients();
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNote = createAsyncThunk(
  "psychologist/createNote",
  async (
    {
      patientId,
      content,
      isPrivate,
    }: { patientId: number; content: string; isPrivate?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const res = await createNoteApi({ patientId, content, isPrivate });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPatientNotes = createAsyncThunk(
  "psychologist/fetchNotes",
  async (patientId: number, { rejectWithValue }) => {
    try {
      const res = await getPatientNotes(patientId);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPlan = createAsyncThunk(
  "psychologist/createPlan",
  async (
    {
      patientId,
      title,
      description,
      goals,
      tasks,
      startDate,
      endDate,
    }: {
      patientId: number;
      title: string;
      description?: string;
      goals?: string[];
      tasks?: string[];
      startDate?: string;
      endDate?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await createTreatmentPlanApi({
        patientId,
        title,
        description,
        goals,
        tasks,
        startDate,
        endDate,
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePlan = createAsyncThunk(
  "psychologist/updatePlan",
  async (
    {
      planId,
      data,
    }: {
      planId: number;
      data: Partial<TreatmentPlan>;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await updateTreatmentPlanApi(planId, data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPatientPlans = createAsyncThunk(
  "psychologist/fetchPlans",
  async (patientId: number, { rejectWithValue }) => {
    try {
      const res = await getPatientTreatmentPlans(patientId);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const psychologistSlice = createSlice({
  name: "psychologist",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPatient: (state) => {
      state.currentPatientNotes = [];
      state.currentPatientPlans = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchPsychologistProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPsychologistProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchPsychologistProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch patients
    builder
      .addCase(fetchMyPatients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = action.payload;
      })
      .addCase(fetchMyPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create note
    builder
      .addCase(createNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPatientNotes.unshift(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch notes
    builder
      .addCase(fetchPatientNotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPatientNotes = action.payload;
      })
      .addCase(fetchPatientNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create plan
    builder
      .addCase(createPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPatientPlans.unshift(action.payload);
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update plan
    builder
      .addCase(updatePlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.currentPatientPlans.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.currentPatientPlans[index] = action.payload;
        }
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch plans
    builder
      .addCase(fetchPatientPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPatientPlans = action.payload;
      })
      .addCase(fetchPatientPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentPatient } = psychologistSlice.actions;
export default psychologistSlice.reducer;
