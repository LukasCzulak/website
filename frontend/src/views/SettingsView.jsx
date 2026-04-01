import { useState, useRef, useEffect, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import { getCharacters } from "../api/characterService";
import "./SettingsView.css"
import {
  Switch,
  Slider,
  Text,
  Stack,
  Group,
  Button,
  ScrollArea,
} from "@mantine/core";

import { IconAlertTriangle, IconCircleX, IconSun, IconSunFilled } from "@tabler/icons-react";

export function SettingsView({
  initialLowPower,
  initialLimit,
  initialLoops,
  initialInitial,
  onCancel,
  onApply,
  currentUser,
  setCurrentView,
  onLogout,
  onAdminStart,
  setTakenCharIds,
  brightness,
  setBrightness,
}) {
  const clientRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      brokerURL:
        import.meta.env.VITE_API_URL
          ? "wss://" + import.meta.env.VITE_API_URL + "/ws"
          : "ws://localhost:8080/ws",
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("Connected");

        client.subscribe("/topic/startGame", () => {
          console.log("Game started");
          onAdminStart();
        });

        client.subscribe("/topic/chooseCharacter", () => {
          getCharacters()
            .then((chars) => {
              const takenDoc = chars.find((c) => c.id === "taken");
              const takenChars = takenDoc
                ? Object.keys(takenDoc.characters || {})
                : [];
              setTakenCharIds(takenChars);
            })
            .catch((error) => {
              console.error("Fehler beim Laden der Charaktere:", error);
            });
        });
      },

      onError: (error) => {
        console.error("WebSocket-Verbindungsfehler:", error);
      },

      onStompError: (frame) => {
        console.error("STOMP-Fehler:", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [onAdminStart, setTakenCharIds]);

  const puzzleAreaRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // --- LINEARE SONNEN-BERECHNUNG ---

  // Initialisierung: Helligkeit in Winkel umrechnen (Linear)
  // Wir setzen die Sonne standardmäßig auf die linke Seite.
  // Unten ist 270°, Links ist 180°, Oben ist 90°
  const [currentAngle, setCurrentAngle] = useState(() => {
    const angleDeg = 270 - (brightness / 100) * 180;
    return (angleDeg * Math.PI) / 180; // Zurück in Bogenmaß für X/Y Berechnung
  });

  // Externes Update (z.B. Admin drückt "Licht aus")
  // Externes Update (z.B. Admin drückt "Licht aus")
  useEffect(() => {
    if (!isDragging) {
      // Aktuelle erwartete Helligkeit anhand der visuellen Position berechnen
      let angleDeg = (currentAngle * 180) / Math.PI;
      if (angleDeg < 0) angleDeg += 360;
      
      let distToBottom = Math.abs(angleDeg - 270);
      if (distToBottom > 180) distToBottom = 360 - distToBottom;
      
      const expectedBrightness = (distToBottom / 180) * 100; 
      
      if (Math.abs(expectedBrightness - brightness) > 1) {
        const isRightSide = angleDeg < 90 || angleDeg > 270;
        
        let targetDeg;
        if (isRightSide) {
          targetDeg = 270 + (brightness / 100) * 180;
        } else {
          targetDeg = 270 - (brightness / 100) * 180;
        }
        
        setCurrentAngle((targetDeg * Math.PI) / 180);
      }
    }
  }, [brightness, isDragging, currentAngle]);

  const arcConfig = {
    radius: 120,
    centerX: 150, 
    centerY: 150,
  };

  const updateBrightnessFromCoords = useCallback((clientX, clientY) => {
    if (!puzzleAreaRef.current) return;
    const rect = puzzleAreaRef.current.getBoundingClientRect();
    
    // Position relativ zum Zentrum
    const relX = clientX - (rect.left + arcConfig.centerX);
    const relY = (rect.top + arcConfig.centerY) - clientY;

    // Winkel berechnen und visuelle Sonne direkt dorthin setzen
    const angleRad = Math.atan2(relY, relX);
    setCurrentAngle(angleRad);

    let angleDeg = (angleRad * 180) / Math.PI;
    if (angleDeg < 0) angleDeg += 360;

    let distToBottom = Math.abs(angleDeg - 270);
    if (distToBottom > 180) distToBottom = 360 - distToBottom;

    const newBrightness = (distToBottom / 180) * 100;
    
    setBrightness(newBrightness);

    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: "/topic/puzzle/brightness", 
        body: JSON.stringify({ user: currentUser || "Unbekannter Matrose", value: newBrightness }),
      });
    }

  }, [setBrightness, arcConfig.centerX, arcConfig.centerY, currentUser]);

  const sendBrightnessUpdate = useCallback((val) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: "/topic/puzzle/brightness", 
        body: JSON.stringify({ user: currentUser || "Unbekannter Matrose", value: val }),
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!isDragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      updateBrightnessFromCoords(x, y);
    };

    const handleGlobalMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      sendBrightnessUpdate(brightness); 
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchmove", handleGlobalMouseMove);
    window.addEventListener("touchend", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchmove", handleGlobalMouseMove);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, [isDragging, updateBrightnessFromCoords, sendBrightnessUpdate, brightness]);

  const sunVisualX = arcConfig.centerX + arcConfig.radius * Math.cos(currentAngle);
  const sunVisualY = arcConfig.centerY - arcConfig.radius * Math.sin(currentAngle); 

  const sunIntensity = brightness / 100;


  // save unsaved changes
  const [lowPower, setLowPower] = useState(initialLowPower);
  const [limit, setLimit] = useState(initialLimit);
  const [loops, setLoops] = useState(initialLoops);
  const [initialParticles, setInitialParticles] = useState(initialInitial);

  const calculatePerformance = () => {
    if (lowPower) {
      return 0;
    }
    return limit + 10 * loops + initialParticles / 4;
  };

  const handleLogout = () => {
    // inform parent so it can reset state and storage
    if (onLogout) onLogout();
  };

  return (
    <div
      className={`stats-overlay ${isDragging ? "unselectable" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="stats-modal unselectable" // Verhindert Markierungen während des Dragging
        style={{ maxWidth: "550px", position: "relative" }}
      >
        <Button
          onClick={onCancel}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
          }}
          radius="xl"
          w={40}
          h={40}
          p={0}
          variant="transparent"
          c="#8c765a"
        >
          <IconCircleX size={40} c="#8c765a" />
        </Button>
        <ScrollArea h="80vh" mw="490px" type="never" scrollbars="y">
          <div className="stats-header" style={{ paddingBottom: "15px" }}>
            <div className="stats-title-group">
              <h2>Grafik & Leistung</h2>
              <span className="stats-title">
                Passe das Schiff an dein Gerät an
              </span>
            </div>
          </div>

          <div
            className="stats-body"
            style={{ textAlign: "left", color: "#c9a473", padding: "10px 0" }}
          >
            <Stack spacing="xl">
              <Group position="apart">
                <div>
                  <Text size="lg" weight={600}>
                    Sparmodus (Animationen aus)
                  </Text>
                  <Text size="sm" c="dimmed" style={{ color: "#c9a473" }}>
                    Empfohlen für ältere Handys
                  </Text>
                </div>
                <Switch
                  checked={lowPower}
                  onChange={(e) => setLowPower(e.currentTarget.checked)}
                  size="lg"
                  color="#c9a473"
                />
              </Group>

              {/* SONNEN-RÄTSEL KREIS */}
              <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Group position="apart" mb="xs" style={{ width: "100%" }}>
                  <Text weight={500}>Bildschirmhelligkeit</Text>
                  <Text weight={700} c="#c9a473">{Math.round(brightness)}%</Text>
                </Group>

                {/* Box ist jetzt 300x300 für einen vollen Kreis */}
                <div 
                  ref={puzzleAreaRef}
                  style={{ position: "relative", width: "300px", height: "300px", marginBottom: "10px" }}
                >
                  {/* Voller Kreis aus gestrichelten Linien */}
                  <svg width="300" height="300" style={{ position: "absolute", top: 0, left: 0 }}>
                    <circle 
                      cx="150" 
                      cy="150" 
                      r="120" 
                      fill="transparent" 
                      stroke="#5c4b37" 
                      strokeWidth="4" 
                      strokeDasharray="8 8" 
                    />
                  </svg>

                  {/* Die visuelle Sonne */}
                  <div 
                    style={{ 
                      position: "absolute", top: 0, left: 0, width: "40px", height: "40px",
                      transform: `translate(${sunVisualX - 20}px, ${sunVisualY - 20}px)`, 
                      transition: isDragging ? "none" : "transform 0.2s ease-out", 
                      boxShadow: `0 0 ${sunIntensity * 50}px ${sunIntensity * 20}px rgba(255, 215, 0, 0.5)`,
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      pointerEvents: "none", zIndex: 5
                    }}
                  >
                    <IconSun size={40} color="#c9a473" style={{ position: "absolute" }} />
                    <IconSunFilled size={40} color="#ffd700" style={{ position: "absolute", opacity: sunIntensity }} />
                  </div>

                  {/* Interaktor */}
                  <div 
                    className="sun-puzzle-interactor"
                    onMouseDown={(e) => {
                      setIsDragging(true);
                      updateBrightnessFromCoords(e.clientX, e.clientY);
                    }}
                    onTouchStart={(e) => {
                      if (e.cancelable) e.preventDefault(); 
                      setIsDragging(true);
                      updateBrightnessFromCoords(e.touches[0].clientX, e.touches[0].clientY);
                    }}
                  />
                </div>
              </div>

              <div>
                <Group position="apart" mb="xs">
                  <Text weight={500}>Maximale Partikelanzahl</Text>
                  <Text weight={700} c="#c9a473">
                    {limit}
                  </Text>
                </Group>
                <Slider
                  value={limit}
                  onChange={setLimit}
                  min={1}
                  max={100}
                  disabled={lowPower}
                  color="orange"
                  marks={[{ value: 20, label: "Normal" }]}
                />
              </div>

              <div style={{ marginTop: "15px" }}>
                <Group position="apart" mb="xs">
                  <Text weight={500}>Nebel Spawner</Text>
                  <Text weight={700} c="#c9a473">
                    {loops}
                  </Text>
                </Group>
                <Slider
                  value={loops}
                  onChange={setLoops}
                  min={1}
                  max={20}
                  disabled={lowPower}
                  color="orange"
                  marks={[{ value: 3, label: "Normal" }]}
                />
              </div>

              <div style={{ marginTop: "15px" }}>
                <Group position="apart" mb="xs">
                  <Text weight={500}>Start-Partikel beim Laden</Text>
                  <Text weight={700} c="#c9a473">
                    {initialParticles}
                  </Text>
                </Group>
                <Slider
                  value={initialParticles}
                  onChange={setInitialParticles}
                  min={1}
                  max={100}
                  disabled={lowPower}
                  color="orange"
                  marks={[{ value: 5, label: "Normal" }]}
                />
              </div>
            </Stack>
          </div>

          {!lowPower && calculatePerformance() >= 100 && (
            <div>
              <IconAlertTriangle size={32} />
              <Text>
                {" "}
                Warnung: Aktuelle Einstellungen könnten Ihr Gerät
                verlangsamen!{" "}
              </Text>
            </div>
          )}

          <div
            className="stats-footer"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "40px",
            }}
          >
            <button
              className="pirate-btn"
              style={{ background: "#8b0000", color: "white" }}
              onClick={onCancel}
            >
              Abbrechen
            </button>

            <button
              className="pirate-btn"
              style={{ background: "#5c4b37", color: "white" }}
              onClick={() => onApply(false, 25, 3, 5)}
            >
              Standard
            </button>

            <button
              className="pirate-btn"
              onClick={() => onApply(lowPower, limit, loops, initialParticles)}
            >
              Übernehmen
            </button>
          </div>

          <div
            className="stats-header"
            style={{ paddingBottom: "15px", marginTop: "2rem" }}
          >
            <div className="stats-title-group">
              <h2>Profil</h2>
              <span className="stats-title">
                Verwalte den spielenden Matrosen
              </span>
            </div>
          </div>
          <div
            className="stats-body"
            style={{ textAlign: "left", color: "#c9a473", padding: "10px 0" }}
          >
            <Text> Aktuell angemeldeter Matrose: {currentUser}</Text>
            <Button
              h="50px"
              mt="1rem"
              className="pirate-btn"
              onClick={() => handleLogout()}
            >
              {" "}
              Abmelden{" "}
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
