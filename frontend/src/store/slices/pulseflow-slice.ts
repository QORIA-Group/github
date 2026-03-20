import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PulseFlowStatus } from '../../../../shared/types/pulseflow';

interface PulseFlowState {
  status: PulseFlowStatus | null;
  loading: boolean;
  error: string | null;
}

const initialState: PulseFlowState = {
  status: null,
  loading: false,
  error: null,
};

export const fetchPulseFlowStatus = createAsyncThunk('pulseflow/fetchStatus', async () => {
  const token = localStorage.getItem('qoria_token');
  const res = await fetch('/api/pulseflow/status', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch PulseFlow status');
  return res.json() as Promise<PulseFlowStatus>;
});

const pulseflowSlice = createSlice({
  name: 'pulseflow',
  initialState,
  reducers: {
    clearStatus(state) {
      state.status = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPulseFlowStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPulseFlowStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
      })
      .addCase(fetchPulseFlowStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export const { clearStatus } = pulseflowSlice.actions;
export default pulseflowSlice.reducer;
