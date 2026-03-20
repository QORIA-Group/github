import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TenantContext } from '../../../../shared/types/tenant';

interface AuthReduxState {
  tenantContext: TenantContext | null;
}

const initialState: AuthReduxState = {
  tenantContext: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTenantContext(state, action: PayloadAction<TenantContext>) {
      state.tenantContext = action.payload;
    },
    clearTenantContext(state) {
      state.tenantContext = null;
    },
  },
});

export const { setTenantContext, clearTenantContext } = authSlice.actions;
export default authSlice.reducer;
