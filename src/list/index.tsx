import { GridView } from "components";
import { useParams } from "react-router-dom";

export default function List() {
  const { name } = useParams();
  return <GridView gridName={name} />;
}
