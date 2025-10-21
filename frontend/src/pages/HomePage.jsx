import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <>
      <h1>Lukas Czulak</h1>
      <p>
        Hier entsteht eine ganz tolle Website. <br />
        Für mehr infos: info@lukasczulak.de
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        <Link to="/devlog">
          <button>Go to DevLog</button>
        </Link>
        <Link to="/game">
          <button>Go to Game</button>
        </Link>
      </div>
    </>
  );
}
