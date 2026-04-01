const API_URL = "https://" + import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function getCharacters() {
  const res = await fetch(`${API_URL}/api/characters`);
  if (!res.ok) {
    throw new Error("Failed to fetch characters");
  }
  return res.json();
}

export async function createCharacter(characterData) {
  const res = await fetch(`${API_URL}/api/characters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(characterData),
  });

  if (!res.ok) {
    throw new Error("Failed to create character");
  }
  return res.json();
}

export async function updateTakenChars(data) {
  const res = await fetch(`${API_URL}/api/characters/taken`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update taken characters");
  }

  return true;
}
