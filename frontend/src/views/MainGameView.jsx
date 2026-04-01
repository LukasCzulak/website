import { useState } from "react";
import { Button, Modal } from "@mantine/core";
import { IconInfoCircle, IconSword } from "@tabler/icons-react";
import { ParsedText } from "../utils/ParsedText";
import { useWebSocket } from "../utils/WebSocketContext";
import "./MainGameView.css";

function EntityAvatar({ entityName, dbChar }) {
  const [imgError, setImgError] = useState(false);
  
  // try using icon, else guess the enemy icon by their name
  const imgSrc = dbChar?.icon ? `/icons/${dbChar.icon}` : `/enemies/${entityName}_Icon.webp`;

  if (imgError) {
    return <span>{entityName.charAt(0).toUpperCase()}</span>;
  }

  return (
    <img 
      src={imgSrc} 
      alt={entityName} 
      onError={() => setImgError(true)}
      style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.15)" }} 
    />
  );
}

function AbilityRow({ ability, type, onActivate, onInfo, isPassive }) {
  if (!ability) return null;

  return (
    <div className="ability-row">
      <div 
        className={`ability-icon-wrapper ${isPassive ? 'passive-icon' : 'clickable'}`} 
        onClick={() => {
          if (!isPassive) onActivate(ability, type);
        }}
      >
        {ability.icon ? (
          <img src={"/abilities/" + ability.icon} alt={type} className="ability-img" />
        ) : (
          <div className="ability-img-placeholder">{type.charAt(0)}</div>
        )}
        {ability.cooldown > 0 && (
          <div className="ability-cd-badge">{ability.cooldown}</div>
        )}
      </div>
      
      <div className="ability-info desktop-only">
        <div className="ability-header">
          <span className="ability-type">{type}</span>
        </div>
        <div className="ability-desc">
          <ParsedText text={ability.description} />
        </div>
      </div>

      <button className="ability-info-btn mobile-only" onClick={() => onInfo(ability, type)}>
        <IconInfoCircle size={28} />
      </button>
    </div>
  );
}

export function MainGameView({ setCurrentView, character, allCharacters }) {
  const [selectedAbility, setSelectedAbility] = useState(null);
  const { combatState } = useWebSocket();

  if (!character) {
    return <div className="loading-text">Loading character...</div>;
  }

  const handleActivateAbility = (ability, type) => {
    console.log(`Activating ${type}!`, ability);
    // TODO: Send WebSocket message to use ability/attack!
  };

  const handleShowInfo = (item, type) => {
    setSelectedAbility({ ...item, type });
  };

  const championInfoData = {
    description: character.description || "Ein mächtiger Champion der Meere.",
    cooldown: 0
  };

  const autoAttackData = {
    description: `Führe einen normalen Angriff aus. Verursacht ${character.attack_damage} Schaden. Du kannst in jeder Runde bis zu ${character.attack_speed} Mal angreifen.`,
    cooldown: 0
  };

  return (
    <div className="game-container">
      
      {combatState?.inCombat && (
        <div className="initiative-tracker" style={{
          position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: "10px", background: "rgba(15, 20, 25, 0.9)",
          padding: "10px 20px", borderRadius: "8px", border: "1px solid #c9a473",
          zIndex: 100, alignItems: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.6)"
        }}>
          <span style={{ color: "#c9a473", fontWeight: "bold", marginRight: "10px" }}>
            Runde {combatState.round}
          </span>
          
          {combatState.turnOrder.map((entityName, index) => {
            const isTurn = combatState.turnIndex === index;
            const dbChar = allCharacters?.find(c => c.id === entityName || c.name === entityName);
            
            const isPlayer = !!dbChar; 
            const isMe = character?.id === entityName || character?.name === entityName;
            
            let borderColor = "#8b0000"; // Enemy: Red
            if (isMe) borderColor = "#caa36f"; // Me: Gold
            else if (isPlayer) borderColor = "#107a32"; // Ally: Dark Green

            return (
              <div key={index} style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "#a1a1a1",
                border: `3px solid ${borderColor}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: "bold", fontSize: "1.2rem",
                transform: isTurn ? "scale(1.2)" : "scale(1)",
                transition: "all 0.3s ease",
                overflow: "hidden" 
              }}>
                <EntityAvatar entityName={entityName} dbChar={dbChar} />
              </div>
            );
          })}
        </div>
      )}

      <div className="top-left">
        <div 
          className="champ-icon-circle clickable"
          onClick={() => handleShowInfo(championInfoData, character.name)}
        >
          {character.icon ? (
            <img src={"/icons/" + character.icon} alt={character.name} className="champ-img" />
          ) : (
            character.name.charAt(0)
          )}
        </div>

        <div className="profile-details">
          <div className="stats-title-group desktop-only">
            <h2>{character.name}</h2>
            <span className="stats-title">{character.title || "Titel unbekannt"}</span>
          </div>
          
          <div className="auto-attack-container">
            <button 
              className="aa-action-btn" 
              onClick={() => handleActivateAbility(autoAttackData, "Standardangriff")}
            >
              <IconSword size={22} color="#2b1d0f" stroke={2} />
            </button>
            <div className="aa-stats">
              <span style={{ color: "#ff4d4d", fontWeight: "bold" }}>{character.attack_damage} DMG</span>
              <span style={{ color: "#c9a473", margin: "0 4px" }}>|</span>
              <span style={{ color: "#4ade80", fontWeight: "bold" }}>{character.attack_speed} SPD</span>
            </div>
            <button className="ability-info-btn aa-info-btn mobile-only" onClick={() => handleShowInfo(autoAttackData, "Standardangriff")}>
              <IconInfoCircle size={22} />
            </button>
          </div>
        </div>
      </div>

      <div className="health-bar-container">
        <span className="health-label desktop-only">HP</span>
        <div className="health-bar-wrapper">
          <div className="health-bar-fill" style={{ width: "100%" }}></div>
          <span className="health-text">{character.hitpoints} / {character.hitpoints}</span>
        </div>
      </div>

      <div className="abilities-hud">
        <AbilityRow 
          ability={character.abilities?.passive} 
          type="Passive" 
          isPassive={true}
          onInfo={handleShowInfo} 
        />
        <AbilityRow 
          ability={character.abilities?.regular} 
          type="Regulär" 
          onActivate={handleActivateAbility}
          onInfo={handleShowInfo} 
        />
        <AbilityRow 
          ability={character.abilities?.ultimate} 
          type="Ultimativ" 
          onActivate={handleActivateAbility}
          onInfo={handleShowInfo} 
        />
      </div>

      <Button className="leave-button" color="red" onClick={() => setCurrentView("selection")}>
        Leave Game
      </Button>

      {!!selectedAbility && (
        <div className="custom-modal-overlay" onClick={() => setSelectedAbility(null)}>
          <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="custom-modal-header">
              <strong>{selectedAbility?.type}</strong>
              <button className="custom-modal-close" onClick={() => setSelectedAbility(null)}>
                ✖
              </button>
            </div>

            <div className="custom-modal-body">
              {selectedAbility?.cooldown > 0 && (
                <div style={{ marginBottom: "10px", color: "#e6c898", fontWeight: "bold" }}>
                  Cooldown: {selectedAbility.cooldown} Runden
                </div>
              )}
              <ParsedText text={selectedAbility?.description} />
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
