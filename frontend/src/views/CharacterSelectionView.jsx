import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { getCharacters } from "../api/characterService";

export function CharacterSelectionView({
  characters,
  lockedCharId,
  takenCharIds,
  onSelectCharacter,
  onAdminStart,
  currentUser,
  isAdmin,
  setTakenCharIds,
}) {
  const clientRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      brokerURL:
        import.meta.env.VITE_API_URL
          ? (import.meta.env.VITE_API_URL.includes("localhost")
              ? "ws://" + import.meta.env.VITE_API_URL + "/ws"
              : "wss://" + import.meta.env.VITE_API_URL + "/ws")
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

  const handleStart = () => {
    const client = clientRef.current;

    if (client?.connected) {
      client.publish({
        destination: "/app/startGame",
        body: "clicked",
      });
    }
  };

  return (
    <div className="selection-wrapper">
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          zIndex: 10,
          position: "relative",
        }}
      >
        Wähle deinen Champion
      </h2>

      <div className="champ-grid">
        {characters.map((char) => {
          const isMine = lockedCharId === char.id;
          const isTaken = takenCharIds ? takenCharIds.includes(char.id) : [];

          let statusClass = "status-neutral";
          if (isMine) statusClass = "status-mine";
          else if (isTaken) statusClass = "status-taken";

          return (
            char.id !== "taken" && (
              <div
                key={char.id}
                className={`champ-icon-container ${statusClass}`}
                onClick={() => onSelectCharacter(char)}
              >
                <div className="champ-icon-circle">
                  {char.icon ? (
                    <img
                      src={"/icons/" + char.icon}
                      alt={char.name}
                      className="champ-img"
                    />
                  ) : (
                    char.name.charAt(0)
                  )}
                </div>
                <span className="champ-name">{char.name}</span>

                {isTaken && !isMine && (
                  <span className="taken-label">Vergeben</span>
                )}
              </div>
            )
          );
        })}
      </div>

      {isAdmin && (
        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <button
            className="pirate-btn admin-btn"
            onClick={() => handleStart()}
          >
            (DM) Spiel starten
          </button>

          <button
            className="pirate-btn"
            onClick={() => onSelectCharacter({ id: "NEW_CHAR" })}
            style={{ backgroundColor: "#2d6b45" }}
          >
            + Champion erstellen
          </button>
        </div>
      )}
    </div>
  );
}
