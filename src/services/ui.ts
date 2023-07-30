import { store } from "reducer/store";
import { addModal, ModalType } from "reducer/modals.slice";
import { AlertType } from "interfaces";
function alert(msg: string, type?: AlertType) {
  store.dispatch(addModal({ type: ModalType.Alert, msg }));
}
function confirm(msg: string) {
  return new Promise((resolve, reject) => {
    store.dispatch(
      addModal({
        type: ModalType.Confirm,
        msg,
        cb: (rs: boolean) => {
          if (rs) {
            return resolve(null);
          }
          return reject();
        },
      })
    );
  });
}
function prompt(msg: string) {
  return "1";
}
const ui = { alert, confirm, prompt };
export default ui;
