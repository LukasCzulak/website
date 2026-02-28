export async function getUsers() {
  const res = await fetch("http://localhost:8080/api/user");
  return res.json();
}

export async function createUser(data) {
  // Generate a unique ID for the document
  const id = crypto.randomUUID();
  const res = await fetch("http://localhost:8080/api/user", {
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
  const res = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), // { username, password }
  });
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Login failed: ${res.status} - ${errorData}`);
  }
  return res.json();
}
