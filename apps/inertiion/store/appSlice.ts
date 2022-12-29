import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { LocalUser } from "@types";

type AppState = {
  loading: boolean;
  user: LocalUser | null;
};

const initialState: AppState = {
  loading: false,
  user: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
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

export const { clearUser, setLoading, setUser } = appSlice.actions;
