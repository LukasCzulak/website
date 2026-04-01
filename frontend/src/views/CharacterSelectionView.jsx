import { useEffect, useRef } from "react";
import { getCharacters } from "../api/characterService";
import { useWebSocket } from "../utils/WebSocketContext";

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
  const { stompClient, gameStartTrigger, charUpdateTrigger } = useWebSocket();

  const lastGameTrigger = useRef(gameStartTrigger);
  const lastCharTrigger = useRef(charUpdateTrigger);

  useEffect(() => {
    if (gameStartTrigger > lastGameTrigger.current) {
      console.log("Game started");
      onAdminStart();
      lastGameTrigger.current = gameStartTrigger;
    }
  }, [gameStartTrigger, onAdminStart]);

  useEffect(() => {
    if (charUpdateTrigger > lastCharTrigger.current) {
      getCharacters().then((chars) => {
        const takenDoc = chars.find((c) => c.id === "taken");
        setTakenCharIds(takenDoc ? Object.keys(takenDoc.characters || {}) : []);
      }).catch(err => console.error(err));
      
      lastCharTrigger.current = charUpdateTrigger;
    }
  }, [charUpdateTrigger, getCharacters, setTakenCharIds]);

  const handleStart = () => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
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
