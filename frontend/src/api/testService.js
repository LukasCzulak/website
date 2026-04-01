let API_URL = "http://localhost:8080";

if (import.meta.env.VITE_API_URL) {
  API_URL = import.meta.env.VITE_API_URL.startsWith("http") 
    ? import.meta.env.VITE_API_URL 
    : "https://" + import.meta.env.VITE_API_URL;
}

export async function getTests() {
  const res = await fetch(`${API_URL}/api/test`);
  return res.json();
}

export async function createTest(data) {
  const id = crypto.randomUUID();
  const res = await fetch(`${API_URL}/api/test`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Failed to create test: ${res.status} - ${errorData}`);
  }
  return res.json();
}
