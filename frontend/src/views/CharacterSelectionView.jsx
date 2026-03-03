import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

export function CharacterSelectionView({
  characters,
  lockedCharId,
  takenCharIds,
  onSelectCharacter,
  onAdminStart,
  currentUser,
  isAdmin,
}) {
  const clientRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: "wss://" + import.meta.env.VITE_API_URL + "/ws" || "wss://http://localhost:8080/ws",
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("Connected");

        client.subscribe("/topic/startGame", () => {
          console.log("Game started");
          onAdminStart();
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [onAdminStart]);

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
          const isTaken = takenCharIds.includes(char.id);

          let statusClass = "status-neutral";
          if (isMine) statusClass = "status-mine";
          else if (isTaken) statusClass = "status-taken";

          return (
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
          );
        })}
      </div>

      {isAdmin && (
        <div style={{ textAlign: "center", marginTop: "40px", display: "flex", justifyContent: "center", gap: "20px" }}>
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
