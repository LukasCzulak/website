import { Button } from "@mantine/core";

export function MainGameView({ setCurrentView }) {
  return (
    <div style={{ padding: "2rem", textAlign: "center", zIndex: 0 }}>
      <h2>Main Game here</h2>
      <p>Hier ist später das Interface mit Lebensbalken, Fähigkeiten etc.</p>

      <Button onClick={() => setCurrentView("selection") }> Go Back </Button>
    </div>
  );
}
