import { configureStore, createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: { data: [] },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    }
  }
});

export const { setData } = dashboardSlice.actions;

const store = configureStore({
  reducer: {
    dashboard: dashboardSlice.reducer
  }
});

export default store;
