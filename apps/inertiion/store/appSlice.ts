import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { LocalUser } from "@types";

type AppState = {
  isInitialLoadComplete: boolean;
  loading: boolean;
  user: LocalUser | null;
};

const initialState: AppState = {
  isInitialLoadComplete: false,
  loading: false,
  user: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setInitialLoadStatus: (state, { payload }: PayloadAction<boolean>) => {
      state.isInitialLoadComplete = payload;
    },
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.loading = payload;
    },

    // User
    setUser: (state, { payload }: PayloadAction<LocalUser>) => {
      state.user = payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { clearUser, setLoading, setUser, setInitialLoadStatus } =
  appSlice.actions;
