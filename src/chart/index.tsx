import { useParams } from "react-router-dom";

export default function Chart() {
  const { type } = useParams();
  switch (type) {
    default:
      return <p>Chart {type}</p>;
  }
}
