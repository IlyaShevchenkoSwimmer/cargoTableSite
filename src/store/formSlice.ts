import { createSlice } from "@reduxjs/toolkit";

const initialState: { text: string; date: string } = { text: "", date: "" };

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    changeForm(
      state,
      action: {
        payload: { text: string; date: string };
        type: string;
      }
    ) {
      state.text = action.payload.text;
      state.date = action.payload.date;
    },
  },
});

export const { changeForm } = formSlice.actions;

export default formSlice.reducer;
