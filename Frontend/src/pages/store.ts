import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Profile/reducer";

const store = configureStore({
  reducer: {
    accountReducer,
  },
});
export default store;
