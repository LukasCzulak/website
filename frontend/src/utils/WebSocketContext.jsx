import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export function WebSocketProvider({ children }) {
  const [stompClient, setStompClient] = useState(null);
  const [combatState, setCombatState] = useState(null);

  const [playerBrightness, setPlayerBrightness] = useState({});
  const [dimLightsTrigger, setDimLightsTrigger] = useState(0);

  const [gameStartTrigger, setGameStartTrigger] = useState(0);
  const [charUpdateTrigger, setCharUpdateTrigger] = useState(0);

  const [dmg, setDmg] = useState(0);
  const [champDmg, setChampDmg] = useState("");
  const [heal, setHeal] = useState(0);
  const [champHeal, setChampHeal] = useState("");

  const [ulti, setUlti] = useState("");
  const [cue, setCue] = useState("");

  useEffect(() => {
    const client = new Client({
      brokerURL: import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.includes("localhost")
          ? "ws://" + import.meta.env.VITE_API_URL + "/ws"
          : "wss://" + import.meta.env.VITE_API_URL + "/ws"
        : "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Global WebSocket Connected!");

        // Combat Subscription
        client.subscribe("/topic/combat/state", (message) => {
          try {
            setCombatState(JSON.parse(message.body));
          } catch (error) {
            console.error("Failed to parse combat state", error);
          }
        });

        client.publish({ destination: "/app/combat/sync", body: "" });

        // Admin Puzzle Subscription (Moved from AdminPanel)
        client.subscribe("/topic/puzzle/brightness", (payload) => {
          try {
            const data = JSON.parse(payload.body);
            setPlayerBrightness((prev) => ({
              ...prev,
              [data.user]: data.value,
            }));
          } catch (e) {
            console.error("Fehler beim Parsen der Helligkeit:", e);
          }
        });

        // Player Dim Subscription (Moved from Game)
        client.subscribe("/topic/puzzle/dim", () => {
          // We just increment a number so components know a 'dim' event happened
          setDimLightsTrigger((prev) => prev + 1);
        });

        client.subscribe("/topic/combat/dmg", (message) => {
          const data = JSON.parse(message.body);
          setDmg(data.dmg);
          setChampDmg(data.champ);
        });

        client.subscribe("/topic/combat/heal", (message) => {
          const data = JSON.parse(message.body);
          setHeal(data.heal);
          setChampHeal(data.champ);
        });

        client.subscribe("/topic/combat/ulti", (message) => {
          const data = JSON.parse(message.body);
          setUlti(data.champ);
        });

        client.subscribe("/topic/combat/cue", (message) => {
          const data = JSON.parse(message.body);
          setCue(data.champ);
        });

        client.subscribe("/topic/startGame", () => {
          setGameStartTrigger((prev) => prev + 1);
        });

        client.subscribe("/topic/chooseCharacter", () => {
          setCharUpdateTrigger((prev) => prev + 1);
        });
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        stompClient,
        playerBrightness,
        dimLightsTrigger,
        combatState,
        gameStartTrigger,
        charUpdateTrigger,
        dmg,
        heal,
        champDmg,
        champHeal,
        ulti,
        cue,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}
