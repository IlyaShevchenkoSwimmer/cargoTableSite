import { configureStore } from "@reduxjs/toolkit";
import cargoListSlice from "./cargoListSlice";

const store = configureStore({
  reducer: {
    list: cargoListSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
