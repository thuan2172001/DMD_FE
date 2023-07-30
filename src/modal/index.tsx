import { useSelector } from "react-redux";
import { RootState } from "reducer/store";
import { Button, Icon, Modal, Confirm } from "semantic-ui-react";
import { ModalType, removeModal } from "reducer/modals.slice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
export default function ModalManager() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const modals = useSelector((state: RootState) => state.modals);
  function closeModal(id: number) {
    dispatch(removeModal(id));
  }
  function renderModal(i: any) {
    switch (i.type) {
      case ModalType.Alert:
        return (
          <Modal size={"mini"} open onClose={() => closeModal(i.id)}>
            <Modal.Header>{t("Alert")}</Modal.Header>
            <Modal.Content>
              <p>{t(i.msg)}</p>
            </Modal.Content>
            <Modal.Actions>
              <Button
                onClick={() => {
                  closeModal(i.id);
                }}
                primary
                icon
                labelPosition="left"
              >
                <Icon name="close" />
                {t("Close")}
              </Button>
            </Modal.Actions>
          </Modal>
        );
      case ModalType.Confirm:
        return (
          <Confirm
            content={i.msg}
            key={i.id}
            header={t("Confirm")}
            open={true}
            size="tiny"
            cancelButton={
              <Button icon="close" labelPosition="left" content={t("Cancel")} />
            }
            confirmButton={
              <Button
                icon="check"
                primary
                labelPosition="left"
                content={t("Confirm")}
              />
            }
            onCancel={() => {
              i.cb(false);
              closeModal(i.id);
            }}
            onConfirm={() => {
              i.cb(true);
              closeModal(i.id);
            }}
          />
        );
    }
  }
  return <div>{modals.map((i: any) => renderModal(i))}</div>;
}
