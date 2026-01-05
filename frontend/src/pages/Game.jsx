import { useState } from "react";
import { Link } from "react-router-dom";
import { IconHome, IconBattery, IconBatteryOff } from "@tabler/icons-react";
import { TestComponent } from "./test.jsx";
import "./Game.css";

export function Game() {
  const [lowPowerMode, setLowPowerMode] = useState(false);
  return (
    <div className="game-container">
      <div className="game-background" />
      {!lowPowerMode && (
        <>
          <div className="fog-layer fog-layer-1" />
          <div className="fog-layer fog-layer-2" />
          <div className="fog-layer fog-layer-3" />
          <div className="fog-layer fog-layer-4" />
        </>
      )}

      <Link to="/home" style={{ position: "absolute", top: 20, left: 20, color: "#c9a473" }}>
        <IconHome />
      </Link>

      <button 
        className="settings-toggle" 
        onClick={() => setLowPowerMode(!lowPowerMode)}
      >
        {lowPowerMode ? <IconBattery /> : <IconBatteryOff />}
        <span>{lowPowerMode ? "Sparmodus an" : "Animationen an"}</span>
      </button>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <h1>Game</h1>
        <p>
          Hier entsteht ein ganz tolles Game. <br />
          Für mehr infos: game@lukasczulak.de
        </p>
        
        <TestComponent />
      </div>
    </div>
  );
}
