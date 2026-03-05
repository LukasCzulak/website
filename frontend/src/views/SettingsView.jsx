import { useState, useRef, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import {
  Switch,
  Slider,
  Text,
  Stack,
  Group,
  Button,
  ScrollArea,
} from "@mantine/core";

import { IconAlertTriangle, IconCircleX } from "@tabler/icons-react";

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
}) {
  const clientRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      brokerURL:
        "wss://" + import.meta.env.VITE_API_URL + "/ws" ||
        "ws://localhost:8080/ws",
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("Connected");

        client.subscribe("/topic/startGame", () => {
          console.log("Game started");
          onAdminStart();
        });

        client.subscribe("/topic/chooseCharacter", (payload) => {
          console.log("character chosen: " + payload.body);
          try {
            const updatedTakenChars = JSON.parse(payload.body);
            setTakenCharIds(updatedTakenChars);
          } catch (error) {
            console.error("Fehler beim Parsen der Nachricht:", error);
          }
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
      className="stats-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="stats-modal"
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
