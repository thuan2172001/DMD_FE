import { createSlice } from "@reduxjs/toolkit";
let id = 1;
const modalsSlice = createSlice({
  name: "ui",
  initialState: [],
  reducers: {
    addModal(state: any[], action) {
      let tmp = Object.assign({}, { ...action.payload, id: id++ });
      state.push(tmp);
    },
    removeModal(state: any[], action): any[] {
      return state.filter((i: any) => i.id !== action.payload);
    },
  },
});
export function removeModalDelay(id: number) {
  return async (dispatch: Function, getState: Function) => {
    setTimeout(() => {
      dispatch(removeModal(id));
    }, 300);
  };
}
export const { addModal, removeModal } = modalsSlice.actions;
export enum ModalType {
  Alert,
  Confirm,
}
export default modalsSlice.reducer;
