import { AlertType } from "interfaces";
import { useState } from "react";
import { useTranslation } from "react-i18next"
import { Button, Input, Modal } from "semantic-ui-react"
import { api, ui } from "services";

export const CancelModal = ({ isOpen, close, item }: any) => {
    const { t } = useTranslation();
    const [newTracking, setNewTracking] = useState('');

    const cancelModal = async () => {
        try {
            await api.post('/order/request-cancel', {
                order_id: item.id,
                new_tracking_id: newTracking
            })
            ui.alert('Successful request cancel !', AlertType.Success)
            close();
        } catch (err: any) {
            ui.alert(`Failed to cancel: ${t(err?.message)}`, AlertType.Warning)
        }
    }

    return (
        <Modal open={isOpen} onClose={() => close()} size="tiny">
            <Modal.Header>{t("Request cancel order")}</Modal.Header>
            <Modal.Content>
                <div>
                    <div className="font-bold">
                        * {t('Please enter new tracking ID if existed before request cancel this order.')}
                    </div>
                    <Input label='New tracking ID' className="w-full mt-2" type="text" onChange={(e, { value }) => {
                        setNewTracking(value)
                    }} />
                </div>
                <div className="flex mt-4 gap-4 justify-center self-center mx-auto w-full">
                    <Button
                        icon="close"
                        onClick={() => {
                            close();
                        }}
                        content={t("Cancel")}
                        color="blue"
                        fluid
                    />{" "}
                    <Button icon="check" content={t("Confirm")} color='green' fluid onClick={cancelModal} />
                </div>
            </Modal.Content>
        </Modal>
    )
}