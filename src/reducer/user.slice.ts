import { createSlice } from "@reduxjs/toolkit";
import { UserEntity } from "interfaces";
const initialState: UserEntity = null;
const todosSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo(state: any, action) {
      return action.payload;
    },
  },
});

export const { setUserInfo } = todosSlice.actions;

export default todosSlice.reducer;
