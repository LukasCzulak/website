import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { IconHome, IconSettings } from "@tabler/icons-react";
import { Loader } from "@mantine/core";

import "./Game.css";
import { DynamicFog } from "./DynamicFog";

import { LoginView } from "../views/LoginView";
import { CharacterSelectionView } from "../views/CharacterSelectionView";
import { CharacterStatsView } from "../views/CharacterStatsView";
import { MainGameView } from "../views/MainGameView";
import { SettingsView } from "../views/SettingsView";
import { CharacterCreationView } from "../views/CharacterCreationView";
import { AdminPanel } from "../views/AdminPanel";

import { getCharacters } from "../api/characterService";

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
  const [takenCharIds, setTakenCharIds] = useState(["Nautilus", "Miss Fortune", "Twisted Fate"]); // von anderen locked-in
  const [currentUser, setCurrentUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u && u !== "null" ? u : "";
  });
  const [userId, setUserId] = useState(() => {
    const id = localStorage.getItem("userId");
    return id && id !== "null" ? id : "";
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    const a = localStorage.getItem("isAdmin");
    return a === "true";
  });

  // sync user with storage whenever it changes, remove when empty
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", currentUser);
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem("userId");
    }
  }, [userId]);

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

  const [characters, setCharacters] = useState([]);
  const [isLoadingChars, setIsLoadingChars] = useState(true);
  const [brightness, setBrightness] = useState(50);

  useEffect(() => {
    getCharacters()
      .then((data) => {
        setCharacters(data);
        setIsLoadingChars(false);
      })
      .catch((err) => {
        console.error("Failed to load characters:", err);
        setIsLoadingChars(false);
      });
  }, []);

  if (isLoadingChars) {
    return (
      <>
        <Loader color = "#c9a473" size={50} />
        <div
          style={{ color: "#c9a473", textAlign: "center", marginTop: "50px" }}
        >
          Lade Champions aus der Datenbank...
        </div>
      </>
    );
  }
  
  const baseBright = 0.05 + (brightness / 100) * 0.95;
  
  const overexposureRatio = brightness > 75 ? (brightness - 75) / 25 : 0;
  
  const extraBright = Math.pow(overexposureRatio, 2) * 1.5;
  const extraSepia = Math.pow(overexposureRatio, 2) * 0.4;
  const extraContrast = Math.pow(overexposureRatio, 2) * 1.2;

  const finalCssBrightness = baseBright + extraBright;
  const finalCssSepia = 0.6 + extraSepia;
  const finalCssContrast = 1.2 + extraContrast;
  const overlayOpacity = Math.pow(overexposureRatio, 2) * 0.7;

  return (
    <div className="game-container">
      <div 
        className="game-background" 
        style={{
          filter: `
            brightness(${finalCssBrightness}) 
            sepia(${finalCssSepia}) 
            contrast(${finalCssContrast})
          ` 
        }} 
      />

      {/* Hohe Helligkeit soll bisschen wehtun */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#fffae6',
          opacity: overlayOpacity,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {!lowPowerMode && (
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
          padding: 0,
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
        {(currentView === "login" || (currentView === "settings" && previousView.current === "login")) && (
          <LoginView
            onLogin={() => onLogin()}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            setUserId={setUserId}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
          />
        )}

        {/* Zeige das Raster an, wenn wir in 'selection' ODER 'stats' sind */}
        {(currentView === "selection" || 
          currentView === "stats" || 
          (currentView === "settings" && (previousView.current === "selection" || previousView.current === "stats"))) && (
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
            setTakenCharIds={setTakenCharIds}
          />
        )}

        {(currentView === "game" || (currentView === "settings" && previousView.current === "game")) && (isAdmin ? (
          <AdminPanel setCurrentView={setCurrentView} />
        ) : (
          <MainGameView 
            setCurrentView={setCurrentView} 
            character={characters.find(c => c.id === lockedCharId)} 
          />
        ))}
      </div>

      {currentView === "stats" && viewingChar?.id === "NEW_CHAR" && (
        <CharacterCreationView
          onCancel={() => setCurrentView("selection")}
          onSuccess={() => {
            setCurrentView("selection");
            window.location.reload();
          }}
        />
      )}

      {currentView === "stats" && viewingChar?.id !== "NEW_CHAR" && (
        <CharacterStatsView
          character={viewingChar}
          isTaken={takenCharIds.includes(viewingChar?.id)}
          isMine={lockedCharId === viewingChar?.id}
          onCancel={() => setCurrentView("selection")}
          onLockIn={() => {
            setLockedCharId(viewingChar?.id);
            setCurrentView("selection");
          }}
          onAdminStart={() => setCurrentView("game")}
          takenCharIds={takenCharIds}
          setTakenCharIds={setTakenCharIds}
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
          setTakenCharIds={setTakenCharIds}
          brightness={brightness}
          setBrightness={setBrightness}
        />
      )}
    </div>
  );
}
