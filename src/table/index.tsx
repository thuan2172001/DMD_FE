import { useParams } from "react-router-dom";
import EventReportTable from "./event-report";
export default function Table() {
  const { type } = useParams();
  switch (type) {
    case "event-report":
      return <EventReportTable />;
    default:
      return <p>Chart {type}</p>;
  }
}
