import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { OrderProps, OrdersScreenNavigatorProps } from "@types";

type OrdersState = {
  localOrders: OrderProps[];
};

const initialState: OrdersState = {
  localOrders: [],
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setLocalOrders: (state, { payload }: PayloadAction<OrderProps[]>) => {
      state.localOrders = payload;
    },
  },
});

export const { setLocalOrders } = ordersSlice.actions;
