import { useRef, useEffect } from "react";
import { Client } from "@stomp/stompjs";

export function CharacterStatsView({
  character,
  isTaken,
  isMine,
  onCancel,
  onLockIn,
  onAdminStart,
}) {
  const clientRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      brokerURL:
        "wss://" + import.meta.env.VITE_API_URL + "/ws" ||
        "wss://http://localhost:8080/ws",
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

  return (
    <div className="stats-overlay">
      <div className="stats-modal">
        <div className="stats-header">
          <div className="stats-icon-large">
            {character.img ? (
              <img
                src={character.img}
                alt={character.name}
                className="champ-img"
              />
            ) : (
              character.name.charAt(0)
            )}
          </div>
          <div className="stats-title-group">
            <h2>{character.name}</h2>
            <span className="stats-title">
              {character.title || "Titel unbekannt"}
            </span>
          </div>
        </div>

        <div className="stats-body">
          {isTaken && !isMine && (
            <p className="status-text error">
              Dieser Champion segelt bereits unter einer anderen Flagge!
            </p>
          )}
          {isMine && (
            <p className="status-text success">
              Das ist dein gewählter Champion!
            </p>
          )}

          <div className="stats-content-box">
            <p style={{ fontStyle: "italic", color: "#8c765a" }}>
              Lore Platzhalter: "In den dunklen Gassen von Bilgewasser..."
            </p>
            <div style={{ marginTop: "20px" }}>
              <strong>Fähigkeiten Vorschau:</strong>
              <ul>
                <li>Passive: Passive</li>
                <li>Q: Boom!</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="stats-footer">
          <button className="pirate-btn secondary" onClick={onCancel}>
            Zurück
          </button>

          {!isTaken && !isMine && (
            <button className="pirate-btn" onClick={onLockIn}>
              Diesen Wählen!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
