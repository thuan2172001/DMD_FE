import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "semantic-ui-react";
import api from "services/api";

export default function ScanData() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [tracking_id, setTrackingId] = useState(null)


  useEffect(() => {
    const load = async () => {
      if (!tracking_id) {
        return;
      }
      let data = tracking_id;
      if (tracking_id.length === 34) {
        data = tracking_id.slice(8);
      }
      if (data.length < 26) {
        return;
      }
      // let rs = await api.post('/order/get-by-tracking', {
      //   tracking: data
      // })
      nav(`/tracking/${data}`)
    }
    load();

  }, [tracking_id])
  return (
    <div className="p-10">
      <div className="text-2xl font-bold">Tracking ID</div>
      <Input
        className="mt-2 w-[500px]"
        name={'Tracking ID'}
        type="text"
        onChange={(evt, { value }) => {
          value = value.trim();
          setTrackingId(value);
        }}
      />
      <div className="w-[120px] mt-4">
        <Button
          onClick={(e) => {
            e.preventDefault();
          }}
          fluid
          color="blue"
        >
          Find
        </Button>
      </div>
    </div>
  )
}
