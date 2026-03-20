import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SanitizedInsight } from '../../../../shared/types/kyra';

interface KyraState {
  insights: SanitizedInsight[];
  loading: boolean;
  error: string | null;
}

const initialState: KyraState = {
  insights: [],
  loading: false,
  error: null,
};

export const fetchInsights = createAsyncThunk('kyra/fetchInsights', async () => {
  const token = localStorage.getItem('qoria_token');
  const res = await fetch('/api/kyra/insights', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch insights');
  return res.json() as Promise<SanitizedInsight[]>;
});

const kyraSlice = createSlice({
  name: 'kyra',
  initialState,
  reducers: {
    clearInsights(state) {
      state.insights = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.insights = action.payload;
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export const { clearInsights } = kyraSlice.actions;
export default kyraSlice.reducer;
