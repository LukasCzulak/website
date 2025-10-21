import { Link } from "react-router-dom";
import { IconHome } from "@tabler/icons-react";

export function BigInt() {
  return (
    <>
      <Link to="/home" style={{ position: "absolute", top: 20, left: 20 }}>
        <IconHome />
      </Link>
      <h2>BigInt</h2>
      <p>
        WIP
      </p>
    </>
  );
}
