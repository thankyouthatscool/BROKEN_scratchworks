import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { OrderProps, OrderItemProps } from "@types";

type OrdersState = {
  localOrders: OrderProps[];
  pickQueue: string[];
  pickedItems: OrderItemProps[];
  priorityPickOrder: string | null;
};

const initialState: OrdersState = {
  localOrders: [],
  pickQueue: [],
  pickedItems: [],
  priorityPickOrder: null,
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Local order
    setLocalOrders: (state, { payload }: PayloadAction<OrderProps[]>) => {
      state.localOrders = payload;
    },

    // Pick Queue
    setPickQueue: (state, { payload }: PayloadAction<string[]>) => {
      state.pickQueue = payload;
    },
    addOrderToPickQueue: (state, { payload }: PayloadAction<string>) => {
      state.pickQueue = Array.from(new Set([...state.pickQueue, payload]));
    },
    removerOrderFromPickQueue: (state, { payload }: PayloadAction<string>) => {
      state.pickQueue = state.pickQueue.filter((order) => order !== payload);
    },
    clearPickQueue: (store) => {
      store.pickQueue = [];
    },

    // Picked Items
    setPickedItems: (state, { payload }: PayloadAction<OrderItemProps[]>) => {
      state.pickedItems = payload;
    },
    addPickedItem: (state, { payload }: PayloadAction<OrderItemProps>) => {
      state.pickedItems = Array.from(new Set([...state.pickedItems, payload]));
    },
    removePickedItem: (state, { payload }: PayloadAction<OrderItemProps>) => {
      state.pickedItems = state.pickedItems.filter(
        (item) => item.id !== payload.id
      );
    },
    clearPickedItems: (store) => {
      store.pickedItems = [];
    },

    // Priority Order
    setPriorityPickOrder: (state, { payload }: PayloadAction<string>) => {
      state.priorityPickOrder = payload;
    },
    removerPriorityPickOrder: (state) => {
      state.priorityPickOrder = null;
    },
  },
});

export const {
  // Local Order
  setLocalOrders,

  // Pick Queue
  setPickQueue,
  addOrderToPickQueue,
  removerOrderFromPickQueue,
  clearPickQueue,

  // Picked Items
  setPickedItems,
  addPickedItem,
  removePickedItem,
  clearPickedItems,

  // Priority Pick Order
  setPriorityPickOrder,
  removerPriorityPickOrder,
} = ordersSlice.actions;
