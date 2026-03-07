import { useEffect, useState, useRef } from "react";
import { Button, Card, Text, Group, Stack, Badge } from "@mantine/core";
import { Client } from "@stomp/stompjs";

export function AdminPanel({ setCurrentView }) {
  const clientRef = useRef(null);
  
  const [playerBrightness, setPlayerBrightness] = useState({});

  useEffect(() => {
    const client = new Client({
      brokerURL: "wss://" + import.meta.env.VITE_API_URL + "/ws" || "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Admin verbunden: Lausche auf Sonnen-Rätsel");
        
        client.subscribe("/topic/puzzle/brightness", (payload) => {
          try {
            const data = JSON.parse(payload.body);
            setPlayerBrightness((prev) => ({
              ...prev,
              [data.user]: data.value,
            }));
          } catch (e) {
            console.error("Fehler beim Parsen der Helligkeit:", e);
          }
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, []);

  const handleDimAll = () => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({ 
        destination: "/topic/puzzle/dim", 
        body: "dim_lights" 
      });
    }
  };

  const playersAtZenith = Object.entries(playerBrightness).filter(
    ([user, val]) => Math.round(val) === 100
  );

  return (
    <div style={{ padding: "2rem", zIndex: 0, maxWidth: "600px", margin: "0 auto", textAlign: "left" }}>
      <h2 style={{ color: "#c9a473", textAlign: "center" }}>Admin Kontrollraum</h2>

      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ background: "rgba(20,20,20,0.8)", borderColor: "#5c4b37" }}>
        <h3 style={{ color: "white", marginTop: 0 }}>Sonnen-Schrein Rätsel</h3>

        <Button
          style={{ background: "#8b0000" }}
          size="lg"
          fullWidth
          mb="xl"
          onClick={handleDimAll}
        >
          Schrein betreten (Licht bei allen löschen)
        </Button>

        <Text weight={600} c="#c9a473" mb="xs">
          Spieler auf exakt 100% Helligkeit (Lösung):
        </Text>

        {playersAtZenith.length === 0 ? (
          <Text c="dimmed" fs="italic">Aktuell niemand am Zenit.</Text>
        ) : (
          <Stack spacing="xs">
            {playersAtZenith.map(([user, val]) => (
              <Group key={user} position="apart">
                <Text c="white">{user}</Text>
                <Badge color="yellow" variant="filled">Hat 100% !</Badge>
              </Group>
            ))}
          </Stack>
        )}

        <div style={{ marginTop: "2rem", borderTop: "1px solid #5c4b37", paddingTop: "1rem" }}>
          <Text weight={600} c="#c9a473" mb="xs">Live-Übersicht aller Matrosen:</Text>
          {Object.entries(playerBrightness).map(([user, val]) => (
            <Group key={user} position="apart">
              <Text c="dimmed" size="sm">{user}</Text>
              <Text c="dimmed" size="sm">{Math.round(val)}%</Text>
            </Group>
          ))}
          {Object.keys(playerBrightness).length === 0 && (
            <Text c="dimmed" size="sm">Noch keine Daten von Spielern empfangen.</Text>
          )}
        </div>
      </Card>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Button variant="outline" color="gray" onClick={() => setCurrentView("selection")}>
          Zurück zur Auswahl
        </Button>
      </div>
    </div>
  );
}
