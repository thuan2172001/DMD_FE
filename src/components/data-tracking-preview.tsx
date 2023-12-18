import { useState } from "react";
import { Icon, Modal } from "semantic-ui-react";

export default function DataTrackingViewer({ val, row }: any) {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  console.log(val);
  return (
    <div className="cursor-pointer">
      <>
        <div
          className="cursor-pointer text-[#3c81c2] font-bold"
          onClick={() => {
            togglePopup();
          }}
        >
          View
        </div>

        <Modal
          open={showPopup}
          onClose={togglePopup}
          size="small"
          className="p-[0px] max-w-custom-full"
        >
          <Modal.Content className="w-[80vw] max-w-[700px] h-[80vh] overflow-y-scroll">
            {[row["tracking_id"], row["container_tracking_id"]].map((id) => {
              if (!val[id]) return <></>;
              return (
                <div>
                  {val[id]?.track_info?.tracking?.providers.map(
                    (provider: any) => {
                      return provider?.events.map((event: any) => {
                        return (
                          <div className="mt-3 border-solid border-t-[1px] py-5 ">
                            <div className="text-main text-base mb-2">
                              {event.time_iso}
                            </div>
                            <div className="font-bold text-lg">
                              {event.location + event.description}
                            </div>
                          </div>
                        );
                      });
                    }
                  )}
                </div>
              );
            })}
          </Modal.Content>
          <Modal.Actions>
            <Icon
              name="close"
              size="large"
              className="cursor-pointer absolute top-[10px] right-[10px]"
              onClick={togglePopup}
            />
          </Modal.Actions>
        </Modal>
      </>
    </div>
  );
}
