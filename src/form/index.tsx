import { FormView } from "components";
import { useLocation, useParams } from "react-router-dom";

export default function Form() {
  const { name, mode } = useParams();
  const { search } = useLocation();  
  const query = new URLSearchParams(search);
  const id = name == "bid-pool" ? query.get("id")  : Number(query.get("id"));
  const embedQuery = query.get("embed");
  let embed = null;
  if (embedQuery) {
    try {
      embed = JSON.parse(embedQuery);
    } catch (error) {}
  }
  return (
    <div>
      <FormView
        formName={name}
        params={{
          mode,
          id,
          embed,
        }}
      />
    </div>
  );
}
