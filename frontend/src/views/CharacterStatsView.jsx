import { useRef, useEffect } from "react";
import { Client } from "@stomp/stompjs";

function ParsedText({ text }) {
  if (!text) return null;

  const parts = text.split(
    /(<red>.*?<\/red>|<purple>.*?<\/purple>|<green>.*?<\/green>|<blue>.*?<\/blue>)/g,
  );

  const renderWithNewlines = (str) => {
    const normalizedStr = str.replace(/\\n/g, "\n");

    return normalizedStr.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line}
        {i !== arr.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith("<red>") && part.endsWith("</red>")) {
          const innerText = part.replace("<red>", "").replace("</red>", "");
          return (
            <span key={index} style={{ color: "red" }}>
              {renderWithNewlines(innerText)}
            </span>
          );
        }

        if (part.startsWith("<purple>") && part.endsWith("</purple>")) {
          const innerText = part
            .replace("<purple>", "")
            .replace("</purple>", "");
          return (
            <span key={index} style={{ color: "purple" }}>
              {renderWithNewlines(innerText)}
            </span>
          );
        }

        if (part.startsWith("<green>") && part.endsWith("</green>")) {
          const innerText = part.replace("<green>", "").replace("</green>", "");
          return (
            <span key={index} style={{ color: "green" }}>
              {renderWithNewlines(innerText)}
            </span>
          );
        }

        if (part.startsWith("<blue>") && part.endsWith("</blue>")) {
          const innerText = part.replace("<blue>", "").replace("</blue>", "");
          return (
            <span key={index} style={{ color: "blue" }}>
              {renderWithNewlines(innerText)}
            </span>
          );
        }

        return <span key={index}>{renderWithNewlines(part)}</span>;
      })}
    </span>
  );
}

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

  return (
    <div
      className="stats-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="stats-modal">
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

          <h3 style={{ color: "#c9a473", marginTop: "25px" }}>Fähigkeiten:</h3>

          <div className="stats-content-box">
            <div style={{ marginTop: "20px" }}>
              <ul
                style={{
                  listStyleType: "none",
                  paddingLeft: 0,
                  marginTop: "10px",
                }}
              >
                <li style={{ marginBottom: "15px" }}>
                  <strong style={{ color: "#c9a473" }}>Passive: </strong>
                  <ParsedText text={character.abilities?.passive.description} />
                </li>

                <li style={{ marginBottom: "15px" }}>
                  <strong style={{ color: "#c9a473" }}>
                    Regulär (CD: {character.abilities?.regular.cooldown}):
                  </strong>{" "}
                  <ParsedText text={character.abilities?.regular.description} />
                </li>

                <li style={{ marginBottom: "15px" }}>
                  <strong style={{ color: "#c9a473" }}>
                    Ultimativ (CD: {character.abilities?.ultimate.cooldown}):
                  </strong>{" "}
                  <ParsedText
                    text={character.abilities?.ultimate.description}
                  />
                </li>
              </ul>
            </div>
          </div>

          {(character.abilities?.hidden_1.activated ||
            character.abilities?.hidden_2.activated) && (
            <div>
              <h3 style={{ color: "#c9a473", marginTop: "25px" }}>
                Versteckt!
              </h3>

              <div className="stats-content-box">
                <ul
                  style={{
                    listStyleType: "none",
                    paddingLeft: 0,
                    marginTop: "10px",
                  }}
                >
                  {character.abilities?.hidden_1.activated && (
                    <li style={{ marginBottom: "15px" }}>
                      <strong style={{ color: "#c9a473" }}>
                        Versteckte Fähigkeit 1:
                      </strong>{" "}
                      <ParsedText
                        text={character.abilities?.hidden_1.description}
                      />
                    </li>
                  )}

                  {character.abilities?.hidden_2.activated && (
                    <li style={{ marginBottom: "15px" }}>
                      <strong style={{ color: "#c9a473" }}>
                        Versteckte Fähigkeit 2:
                      </strong>{" "}
                      <ParsedText
                        text={character.abilities?.hidden_2.description}
                      />
                    </li>
                  )}
                </ul>
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
