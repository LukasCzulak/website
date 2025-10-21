export async function getTests() {
  const res = await fetch("http://localhost:8080/api/test");
  return res.json();
}

export async function createTest(data) {
  // Generate a unique ID for the document
  const id = crypto.randomUUID();
  const res = await fetch("http://localhost:8080/api/test", {
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