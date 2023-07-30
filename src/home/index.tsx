import {
  Button,
} from "semantic-ui-react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  return (
    <div>
      <div className="text-3xl text-center font-bold">Welcome to DND EXPRESS</div>
      <div>
        <Button color="green" size="large" onClick={() => {
          nav('/import-data')
        }}>IMPORT DATA</Button>

        <Button color="green" size="large" onClick={() => {
          nav('/view-data')
        }}>READ DATA</Button>
      </div>
    </div>
  );
}

