import { useState } from "react";
import { Link } from "react-router-dom";
import { IconHome, IconBattery, IconBatteryOff } from "@tabler/icons-react";
import { TestComponent } from "./test.jsx";
import "./Game.css";

import { LoginView } from "../views/LoginView";
import { CharacterSelectionView } from "../views/CharacterSelectionView";
import { CharacterStatsView } from "../views/CharacterStatsView";
import { MainGameView } from "../views/MainGameView";

import fizzIcon from "../assets/icons/Fizz icon.jpg";
import gpIcon from "../assets/icons/Gangplank Icon.webp";
import gravesIcon from "../assets/icons/Graves Icon.webp";
/* hier alle anderen einfügen */
/* ZUERST ALLE IN PNG ODER JPG UMWANDELN!*/

export function Game() {
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [currentView, setCurrentView] = useState('login'); // 'login', 'selection', 'stats' or 'game'
  
  const [viewingChar, setViewingChar] = useState(null); // grad am Anschauen
  const [lockedCharId, setLockedCharId] = useState(null); // locked-in character
  const [takenCharIds, setTakenCharIds] = useState(['nautilus', 'missfortune']); // von anderen locked-in

  const characters = [
    { id: 'fizz', name: 'Fizz', title: "Der Gezeitentäuscher", img: fizzIcon },
    { id: 'gp', name: 'Gangplank', title: "Die Salzwassergeißel", img: gpIcon },
    { id: 'graves', name: 'Graves', title: "Der Gesetzlose", img: gravesIcon },
    { id: 'illaoi', name: 'Illaoi', title: "Die Krakenpriesterin", img: null },
    { id: 'missfortune', name: 'Miss Fortune', title: "Die Kopfgeldjägerin", img: null },
    { id: 'nami', name: 'Nami', title: "Die Gezeitenruferin", img: null },
    { id: 'nautilus', name: 'Nautilus', title: "Der Titan der Tiefe", img: null },
    { id: 'nilah', name: 'Nilah', title: "Die entfesselte Freude", img: null },
    { id: 'pyke', name: 'Pyke', title: "Der Schlitzer vom Bluthafen", img: null },
    { id: 'tahm', name: 'Tahm Kench', title: "Der Flusskönig", img: null },
    { id: 'tf', name: 'Twisted Fate', title: "Der Kartenmeister", img: null },
    { id: 'gragas', name: 'Gragas', title: "Der Unruhestifter", img: null },
    { id: 'janna', name: 'Janna', title: "Die Sturmzeugin", img: null },
    { id: 'samira', name: 'Samira', title: "Die Wüstenrose", img: null },
    { id: 'tristana', name: 'Tristana', title: "Die Yordle-Schützin", img: null },
    { id: 'akshan', name: 'Akshan', title: "Der abtrünnige Wächter", img: null },
    { id: 'ryze', name: 'Ryze', title: "Der Runenmagier", img: null },
    { id: 'katarina', name: 'Katarina', title: "Die sinistere Klinge", img: null },
    { id: 'quinn', name: 'Quinn', title: "Die Schwingen von Demacia", img: null }
  ];

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

      <Link to="/home" style={{ position: "absolute", top: 20, left: 20, color: "#c9a473", zIndex: 200 }}>
        <IconHome />
      </Link>

      <button 
        className="settings-toggle" 
        onClick={() => setLowPowerMode(!lowPowerMode)}
        style={{ zIndex: 200 }}
      >
        {lowPowerMode ? <IconBattery /> : <IconBatteryOff />}
        <span>{lowPowerMode ? "Sparmodus an" : "Animationen an"}</span>
      </button>

      <div style={{ position: 'relative', zIndex: 0, height: '100%', paddingTop: '60px' }}>
        
        {currentView === 'login' && (
          <LoginView onLogin={() => setCurrentView('selection')} />
        )}

        {/* Zeige das Raster an, wenn wir in 'selection' ODER 'stats' sind */}
        {(currentView === 'selection' || currentView === 'stats') && (
          <CharacterSelectionView 
            characters={characters}
            lockedCharId={lockedCharId}
            takenCharIds={takenCharIds}
            onSelectCharacter={(char) => {
              setViewingChar(char);
              setCurrentView('stats');
            }} 
            onAdminStart={() => setCurrentView('game')}
          />
        )}

        {currentView === 'game' && (
          <MainGameView />
        )}

      </div>

      {currentView === 'stats' && viewingChar && (
        <CharacterStatsView 
          character={viewingChar}
          isTaken={takenCharIds.includes(viewingChar.id)}
          isMine={lockedCharId === viewingChar.id}
          onCancel={() => setCurrentView('selection')} 
          onLockIn={() => {
            setLockedCharId(viewingChar.id);
            setCurrentView('selection');
          }} 
        />
      )}

    </div>
  );
}
