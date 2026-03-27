import { Link } from "react-router-dom";
import { devlogs } from "../data/devlogsData";
import { IconHome } from "@tabler/icons-react";

export function BigInt() {
  return (
    <>
    <Link to="/home" style={{ position: "absolute", top: 20, left: 20 }}>
        <IconHome />
      </Link>
    <div style={{ padding: "20px" }}>
      <h1>Dev Log</h1>

      {devlogs.map((log) => (
        <div
          key={log.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{log.title}</h3>
          <small>{log.date}</small>
          <p>{log.content}</p>
        </div>
      ))}
    </div>
    </>
  );
}
