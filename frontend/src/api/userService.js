const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function getUsers() {
  const res = await fetch(`${API_URL}/api/user`);
  return res.json();
}

export async function createUser(data) {
  const id = crypto.randomUUID();
  const res = await fetch(`${API_URL}/api/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Failed to create user: ${res.status} - ${errorData}`);
  }
  return res.json();
}

export async function requestLogin(data) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Login failed: ${res.status} - ${errorData}`);
  }
  return res.json();
}
