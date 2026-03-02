import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { IconHome, IconSettings } from "@tabler/icons-react";

import "./Game.css";
import { DynamicFog } from "./DynamicFog";

import { LoginView } from "../views/LoginView";
import { CharacterSelectionView } from "../views/CharacterSelectionView";
import { CharacterStatsView } from "../views/CharacterStatsView";
import { MainGameView } from "../views/MainGameView";
import { SettingsView } from "../views/SettingsView";

import fizzIcon from "../assets/icons/Fizz icon.jpg";
import gpIcon from "../assets/icons/Gangplank Icon.webp";
import gravesIcon from "../assets/icons/Graves Icon.webp";
/* hier alle anderen einfügen */
/* ZUERST ALLE IN PNG ODER JPG UMWANDELN!*/

export function Game() {
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [fogLimit, setFogLimit] = useState(25);
  const [fogLoops, setFogLoops] = useState(3);
  const [fogInitial, setFogInitial] = useState(5);

  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem("currentView") || "login";
  }); // 'login', 'selection', 'stats', 'settings' or 'game'

  const previousView = useRef("selection");

  const [viewingChar, setViewingChar] = useState(null); // grad am Anschauen
  const [lockedCharId, setLockedCharId] = useState(
    () => localStorage.getItem("lockedCharId") || null,
  ); // locked-in character
  const [takenCharIds, setTakenCharIds] = useState(["nautilus", "missfortune"]); // von anderen locked-in
  const [currentUser, setCurrentUser] = useState(
    () => {
      const u = localStorage.getItem("user");
      return u && u !== "null" ? u : "";
    }
  );
  const [isAdmin, setIsAdmin] = useState(
    () => {
      const a = localStorage.getItem("isAdmin");
      return a === "true";
    }
  );

  // sync user with storage whenever it changes, remove when empty
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", currentUser);
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  // move to selection after a successful login
  useEffect(() => {
    if (currentUser && currentView === "login") {
      setCurrentView("selection");
    }
  }, [currentUser, currentView]);

  useEffect(() => {
    localStorage.setItem("currentView", currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem("isAdmin", isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem("lockedCharId", lockedCharId);
  }, [lockedCharId]);

  const onLogin = () => {
    setCurrentView("selection");
    localStorage.setItem("user", currentUser);
  };

  const openSettings = () => {
    previousView.current = currentView; // remember where we came from
    setCurrentView("settings");
  };

  const closeSettings = () => {
    setCurrentView(previousView.current); // go back to where we were
  };

  const characters = [
    { id: "fizz", name: "Fizz", title: "Der Gezeitentäuscher", img: fizzIcon },
    { id: "gp", name: "Gangplank", title: "Die Salzwassergeißel", img: gpIcon },
    { id: "graves", name: "Graves", title: "Der Gesetzlose", img: gravesIcon },
    { id: "illaoi", name: "Illaoi", title: "Die Krakenpriesterin", img: null },
    {
      id: "missfortune",
      name: "Miss Fortune",
      title: "Die Kopfgeldjägerin",
      img: null,
    },
    { id: "nami", name: "Nami", title: "Die Gezeitenruferin", img: null },
    {
      id: "nautilus",
      name: "Nautilus",
      title: "Der Titan der Tiefe",
      img: null,
    },
    { id: "nilah", name: "Nilah", title: "Die entfesselte Freude", img: null },
    {
      id: "pyke",
      name: "Pyke",
      title: "Der Schlitzer vom Bluthafen",
      img: null,
    },
    { id: "tahm", name: "Tahm Kench", title: "Der Flusskönig", img: null },
    { id: "tf", name: "Twisted Fate", title: "Der Kartenmeister", img: null },
    { id: "gragas", name: "Gragas", title: "Der Unruhestifter", img: null },
    { id: "janna", name: "Janna", title: "Die Sturmzeugin", img: null },
    { id: "samira", name: "Samira", title: "Die Wüstenrose", img: null },
    {
      id: "tristana",
      name: "Tristana",
      title: "Die Yordle-Schützin",
      img: null,
    },
    {
      id: "akshan",
      name: "Akshan",
      title: "Der abtrünnige Wächter",
      img: null,
    },
    { id: "ryze", name: "Ryze", title: "Der Runenmagier", img: null },
    {
      id: "katarina",
      name: "Katarina",
      title: "Die sinistere Klinge",
      img: null,
    },
    {
      id: "quinn",
      name: "Quinn",
      title: "Die Schwingen von Demacia",
      img: null,
    },
  ];

  return (
    <div className="game-container">
      <div className="game-background" />
      {!lowPowerMode && currentView !== "settings" && (
        <DynamicFog 
          particleLimit={fogLimit} 
          particleLoops={fogLoops} 
          initialAmount={fogInitial} 
        />
      )}

      <Link
        to="/home"
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "#c9a473",
          zIndex: 200,
        }}
      >
        <IconHome />
      </Link>

      <button
        onClick={openSettings}
        style={{ 
          position: "absolute", 
          top: 20, 
          right: 20, 
          zIndex: 200, 
          background: "transparent", 
          border: "none", 
          color: "#c9a473", 
          cursor: "pointer",
          padding: 0
        }}
      >
        <IconSettings size={32} />
      </button>

      <div
        style={{
          position: "relative",
          zIndex: 0,
          height: "100%",
          paddingTop: "60px",
        }}
      >
        {currentView === "login" && (
          <LoginView
            onLogin={() => onLogin()}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
          />
        )}

        {/* Zeige das Raster an, wenn wir in 'selection' ODER 'stats' sind */}
        {(currentView === "selection" || currentView === "stats") && (
          <CharacterSelectionView
            characters={characters}
            lockedCharId={lockedCharId}
            takenCharIds={takenCharIds}
            onSelectCharacter={(char) => {
              setViewingChar(char);
              setCurrentView("stats");
            }}
            onAdminStart={() => setCurrentView("game")}
            currentUser={currentUser}
            isAdmin={isAdmin}
          />
        )}

        {currentView === "game" && <MainGameView setCurrentView={setCurrentView} />}
      </div>

      {currentView === "stats" && viewingChar && (
        <CharacterStatsView
          character={viewingChar}
          isTaken={takenCharIds.includes(viewingChar.id)}
          isMine={lockedCharId === viewingChar.id}
          onCancel={() => setCurrentView("selection")}
          onLockIn={() => {
            setLockedCharId(viewingChar.id);
            setCurrentView("selection");
          }}
          onAdminStart={() => setCurrentView("game")}
        />
      )}

      {currentView === "settings" && (
        <SettingsView
          initialLowPower={lowPowerMode}
          initialLimit={fogLimit}
          initialLoops={fogLoops}
          initialInitial={fogInitial}
          onCancel={closeSettings}
          onApply={(newPower, newLimit, newLoops, newInitial) => {
            setLowPowerMode(newPower);
            setFogLimit(newLimit);
            setFogLoops(newLoops);
            setFogInitial(newInitial);
            closeSettings();
          }}
          currentUser={currentUser}
          setCurrentView={setCurrentView}
          onLogout={() => {
            setCurrentUser("");
            setIsAdmin(false);
            localStorage.clear();
            setCurrentView("login");
          }}
          onAdminStart={() => setCurrentView("game")}
        />
      )}
    </div>
  );
}
