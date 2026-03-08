import { useRef, useEffect } from "react";
import { ParsedText } from "../utils/ParsedText";
import { Client } from "@stomp/stompjs";

export function CharacterStatsView({
  character,
  isTaken,
  isMine,
  onCancel,
  onLockIn,
  onAdminStart,
  takenCharIds,
  setTakenCharIds,
}) {
  const clientRef = useRef(null);

  const lockIn = () => {
    const client = clientRef.current;
    const takenChars = [...takenCharIds, character];

    if (client?.connected) {
      client.publish({
        destination: "/app/chooseCharacter",
        body: JSON.stringify(takenChars),
      });
    }

    onLockIn();
  };

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

  if (!character) return null;

  const renderAbility = (title, ability, isHidden = false) => {
    if (!ability || (isHidden && !ability.activated)) return null;

    return (
      <div style={{ display: "flex", gap: "15px", alignItems: "flex-start", marginBottom: "20px" }}>
        <div style={{
          position: "relative",
          width: "60px",
          height: "60px",
          borderRadius: "6px",
          border: "2px solid #555",
          background: "#2a2a2a",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {ability.icon ? (
            <img 
              src={"/abilities/" + ability.icon} 
              alt={title} 
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} 
            />
          ) : (
            <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#777" }}>
              {title.charAt(0)}
            </span>
          )}
          
          {ability.cooldown > 0 && (
            <div style={{
              position: "absolute",
              bottom: "-6px",
              right: "-6px",
              background: "#111",
              border: "1px solid #c9a473",
              color: "#e6c898",
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.8)"
            }}>
              {ability.cooldown}
            </div>
          )}
        </div>

        <div>
          <strong style={{ color: "#c9a473", display: "block", marginBottom: "4px" }}>
            {title}
          </strong>
          <ParsedText text={ability.description} />
        </div>
      </div>
    );
  };

  return (
    <div
      className="stats-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      {/* Max Width increased to 800px for a wider layout */}
      <div className="stats-modal" style={{ maxWidth: "690px", width: "90%" }}>
        <div className="stats-header">
          <div className="stats-icon-large">
            {character.icon ? (
              <img
                src={"/icons/" + character.icon}
                alt={character.name}
                className="champ-img"
              />
            ) : (
              character.name?.charAt(0)
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

          <div>
            <p style={{ fontStyle: "italic", color: "#8c765a" }}>
              {character.description}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "15px",
                padding: "10px",
                background: "rgba(0,0,0,0.2)",
                borderRadius: "5px",
              }}
            >
              <span>
                Leben: <strong>{character.hitpoints}</strong>
              </span>
              <span>
                Schaden: <strong>{character.attack_damage}</strong>
              </span>
              <span>
                Speed: <strong>{character.attack_speed}</strong>
              </span>
            </div>
          </div>

          <div className="stats-content-box">
            <div style={{ marginTop: "20px" }}>
              <strong style={{ color: "#c9a473" }}>Spielstil: </strong>
              <ParsedText text={character.playstyle} />
            </div>

            <div style={{ marginTop: "20px" }}>
              <strong style={{ color: "#c9a473" }}>
                Perfekt für dich, wenn:{" "}
              </strong>
              <ParsedText text={character.perfect} />
            </div>
          </div>

          <h3 style={{ color: "#c9a473", marginTop: "25px", marginBottom: "15px" }}>Fähigkeiten:</h3>

          <div className="stats-content-box" style={{ padding: "20px" }}>
            {renderAbility("Passive", character.abilities?.passive)}
            {renderAbility("Regulär", character.abilities?.regular)}
            {renderAbility("Ultimativ", character.abilities?.ultimate)}
          </div>

          {(character.abilities?.hidden_1?.activated ||
            character.abilities?.hidden_2?.activated) && (
            <div>
              <h3 style={{ color: "#c9a473", marginTop: "25px", marginBottom: "15px" }}>
                Versteckt!
              </h3>

              <div className="stats-content-box" style={{ padding: "20px" }}>
                {renderAbility("Versteckte Fähigkeit 1", character.abilities?.hidden_1, true)}
                {renderAbility("Versteckte Fähigkeit 2", character.abilities?.hidden_2, true)}
              </div>
            </div>
          )}
        </div>

        <div className="stats-footer">
          <button className="pirate-btn secondary" onClick={onCancel}>
            Zurück
          </button>

          {!isTaken && !isMine && (
            <button className="pirate-btn" onClick={() => lockIn()}>
              Diesen Wählen!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
