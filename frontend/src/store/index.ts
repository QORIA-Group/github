import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import kyraReducer from './slices/kyra-slice';
import pulseflowReducer from './slices/pulseflow-slice';
import authReducer from './slices/auth-slice';

export const store = configureStore({
  reducer: {
    kyra: kyraReducer,
    pulseflow: pulseflowReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
