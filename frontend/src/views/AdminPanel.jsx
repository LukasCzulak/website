import { Button } from "@mantine/core";

export function AdminPanel({ setCurrentView }) {
  return (
    <div style={{ padding: "2rem", textAlign: "center", zIndex: 0 }}>
      <h2>Admin Panel here</h2>
      <p>Hier ist später das Interface für Admins mit Buttons für Bildschirm dimmen etc.</p>

      <Button onClick={() => setCurrentView("selection") }> Go Back </Button>
    </div>
  );
}
