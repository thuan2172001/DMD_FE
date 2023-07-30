import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import user from "./user.slice";
import modals from "./modals.slice";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));
export const store = configureStore({
  reducer: { user, modals },
  enhancers: [composedEnhancer],
  devTools: false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
