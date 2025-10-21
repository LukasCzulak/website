import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import { HomePage } from "./pages/HomePage";
import { DevLog } from "./pages/DevLog";
import { Game } from "./pages/Game";
import { CzzRenderer } from "./pages/CzzRenderer";
import { BigInt } from "./pages/BigInt";

function App() {

  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/devlog" element={<DevLog />} />
      <Route path="/game" element={<Game />} />
      <Route path="/czzrenderer" element={<CzzRenderer />} />
      <Route path="/bigint" element={<BigInt />} />
      <Route path="/" element={<Navigate to="/home" />} />
    </Routes>
  );
}

export default App;
