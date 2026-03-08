import { useState } from "react";
import { createCharacter } from "../api/characterService";

export function CharacterCreationView({ onCancel, onSuccess }) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    title: "",
    icon: "",
    description: "",
    playstyle: "",
    perfect: "",
    attack_damage: 0,
    attack_speed: 1,
    hitpoints: 0,
    abilities: {
      passive: { description: "", icon: "" },
      regular: { cooldown: 0, description: "", icon: "" },
      ultimate: { cooldown: -1, description: "", icon: "" },
      hidden_1: { activated: false, description: "" },
      hidden_2: { activated: false, description: "" },
    },
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleAbilityChange = (abilityType, field, value) => {
    setFormData((prev) => ({
      ...prev,
      abilities: {
        ...prev.abilities,
        [abilityType]: {
          ...prev.abilities[abilityType],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCharacter(formData);
      alert(`${formData.name} wurde erfolgreich erstellt!`);
      onSuccess();
    } catch (err) {
      alert("Fehler beim Erstellen: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="stats-overlay" style={{ overflowY: "auto", padding: "20px" }}>
      <div className="stats-modal" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "#c9a473", marginBottom: "20px" }}>Neuen Champion erschaffen</h2>
        
        <form 
          onSubmit={handleSubmit} 
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          
          <div style={{ display: "flex", gap: "10px" }}>
            <input required placeholder="ID (z.B. Graves)" name="id" value={formData.id} onChange={handleChange} className="riot-input" style={{ flex: 1 }} />
            <input required placeholder="Anzeigename (z.B. Graves)" name="name" value={formData.name} onChange={handleChange} className="riot-input" style={{ flex: 1 }} />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <input required placeholder="Titel (z.B. Der Gesetzlose)" name="title" value={formData.title} onChange={handleChange} className="riot-input" style={{ flex: 1 }} />
            <input required placeholder="Icon Datei (z.B. graves_icon.webp)" name="icon" value={formData.icon} onChange={handleChange} className="riot-input" style={{ flex: 1 }} />
          </div>

          <textarea required placeholder="Beschreibung" name="description" value={formData.description} onChange={handleChange} className="riot-input" rows="3" />
          <textarea required placeholder="Spielstil" name="playstyle" value={formData.playstyle} onChange={handleChange} className="riot-input" rows="2" />
          <textarea required placeholder="Perfekt für dich, wenn..." name="perfect" value={formData.perfect} onChange={handleChange} className="riot-input" rows="2" />

          <div style={{ display: "flex", gap: "10px" }}>
            <label style={{ color: "white" }}>Leben: <input type="number" name="hitpoints" value={formData.hitpoints} onChange={handleChange} className="riot-input" style={{ width: "80px" }} /></label>
            <label style={{ color: "white" }}>Schaden: <input type="number" name="attack_damage" value={formData.attack_damage} onChange={handleChange} className="riot-input" style={{ width: "80px" }} /></label>
            <label style={{ color: "white" }}>Speed: <input type="number" step="0.1" name="attack_speed" value={formData.attack_speed} onChange={handleChange} className="riot-input" style={{ width: "80px" }} /></label>
          </div>

          <h3 style={{ color: "#c9a473", marginTop: "10px" }}>Fähigkeiten (Mit &lt;red&gt;100&lt;/red&gt; Tags möglich!)</h3>
          
          <textarea placeholder="Passive Beschreibung" value={formData.abilities.passive.description} onChange={(e) => handleAbilityChange("passive", "description", e.target.value)} className="riot-input" rows="2" />
          <input
            placeholder="Passive Icon (z.B. graves_passive.png)"
            value={formData.abilities.passive.icon}
            onChange={(e) =>
              handleAbilityChange("passive", "icon", e.target.value)
            }
            className="riot-input"
            style={{ flex: 1 }}
          />
          
          <div style={{ display: "flex", gap: "10px" }}>
            <input type="number" placeholder="CD" value={formData.abilities.regular.cooldown} onChange={(e) => handleAbilityChange("regular", "cooldown", Number(e.target.value))} className="riot-input" style={{ width: "80px" }} title="Cooldown Regulär" />
            <textarea placeholder="Reguläre Fähigkeit" value={formData.abilities.regular.description} onChange={(e) => handleAbilityChange("regular", "description", e.target.value)} className="riot-input" style={{ flex: 1 }} rows="2" />
          </div>
          <input
            placeholder="Regular Icon (z.B. graves_regular.png)"
            value={formData.abilities.regular.icon}
            onChange={(e) =>
              handleAbilityChange("regular", "icon", e.target.value)
            }
            className="riot-input"
            style={{ flex: 1 }}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <input type="number" placeholder="CD" value={formData.abilities.ultimate.cooldown} onChange={(e) => handleAbilityChange("ultimate", "cooldown", Number(e.target.value))} className="riot-input" style={{ width: "80px" }} title="Cooldown Ultimativ" />
            <textarea placeholder="Ultimative Fähigkeit" value={formData.abilities.ultimate.description} onChange={(e) => handleAbilityChange("ultimate", "description", e.target.value)} className="riot-input" style={{ flex: 1 }} rows="2" />
          </div>
          <input
            placeholder="Ultimate Icon (z.B. graves_ultimate.png)"
            value={formData.abilities.ultimate.icon}
            onChange={(e) =>
              handleAbilityChange("ultimate", "icon", e.target.value)
            }
            className="riot-input"
            style={{ flex: 1 }}
          />

          <textarea placeholder="Versteckte Fähigkeit 1 (Optional)" value={formData.abilities.hidden_1.description} onChange={(e) => handleAbilityChange("hidden_1", "description", e.target.value)} className="riot-input" rows="2" />
          <textarea placeholder="Versteckte Fähigkeit 2 (Optional)" value={formData.abilities.hidden_2.description} onChange={(e) => handleAbilityChange("hidden_2", "description", e.target.value)} className="riot-input" rows="2" />

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <button type="button" className="pirate-btn secondary" onClick={onCancel} disabled={loading}>Abbrechen</button>
            <button type="submit" className="pirate-btn" disabled={loading}>{loading ? "Speichere..." : "Champion erschaffen"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
