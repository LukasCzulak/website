import { Link } from "react-router-dom";
import { IconHome } from "@tabler/icons-react";

export function DevLog() {
  return (
    <>
      <Link to="/home" style={{ position: "absolute", top: 20, left: 20 }}>
        <IconHome />
      </Link>
      <h1>DevLog</h1>
      <p>
        Please have a look at the following projects: <br />
          <Link to="/czzrenderer">
            <button>CzzRenderer</button>
          </Link>
          <Link to="/bigint">
            <button>BigInt</button>
          </Link>
      </p>
    </>
  );
}
