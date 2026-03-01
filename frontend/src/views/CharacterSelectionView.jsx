export function CharacterSelectionView({
  characters,
  lockedCharId,
  takenCharIds,
  onSelectCharacter,
  onAdminStart,
  currentUser,
  isAdmin,
}) {
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
                {char.img ? (
                  <img src={char.img} alt={char.name} className="champ-img" />
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
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button className="pirate-btn admin-btn" onClick={onAdminStart}>
            (DM) Spiel starten
          </button>
        </div>
      )}
    </div>
  );
}
