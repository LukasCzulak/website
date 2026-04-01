import { useState } from "react";
import { Button, Card, Text, Group, Stack, Badge, TextInput } from "@mantine/core";
import { useWebSocket } from "../utils/WebSocketContext";

export function AdminPanel({ setCurrentView, takenCharIds, allCharacters }) {
  const { stompClient, playerBrightness, combatState } = useWebSocket();
  
  const [initiativeInput, setInitiativeInput] = useState("");

  const handleDimAll = () => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({ 
        destination: "/topic/puzzle/dim", 
        body: "dim_lights" 
      });
    }
  };

  const handleStartCombat = () => {
    console.log("Button clicked! stompClient:", stompClient);
    console.log("Connected:", stompClient?.connected);
    console.log("Initiative input:", initiativeInput);
    
    if (stompClient && stompClient.connected && initiativeInput.trim() !== "") {
      const order = initiativeInput.split(",").map((s) => s.trim()).filter(Boolean);
      console.log("Sending combat start order:", order);
      
      stompClient.publish({
        destination: "/app/combat/start", 
        body: JSON.stringify(order)
      });
      console.log("Message published!");
    } else {
      console.log("Cannot start combat - conditions not met");
    }
  };

  const handleNextTurn = () => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/combat/nextTurn",
        body: "" 
      });
    }
  };

  const handlePrevTurn = () => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/combat/prevTurn",
        body: "" 
      });
    }
  };

  const handleEndCombat = () => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/combat/end",
        body: "" 
      });
    }
  };

  const handleAutoFillPlayers = () => {
    if (!takenCharIds || !allCharacters) return;
    
    const playerNames = takenCharIds.map(id => {
      const char = allCharacters.find(c => c.id === id);
      if (char && char.name) {
        return char.name.charAt(0).toUpperCase() + char.name.slice(1);
      }
      return "";
    }).filter(name => name !== "");

    const existing = initiativeInput ? initiativeInput + ", " : "";
    setInitiativeInput(existing + playerNames.join(", "));
  };

  const playersAtZenith = Object.entries(playerBrightness).filter(
    ([user, val]) => Math.round(val) === 100
  );

  return (
    <div style={{ padding: "2rem", zIndex: 0, maxWidth: "600px", margin: "0 auto", textAlign: "left", maxHeight: "100vh", overflowY: "auto" }}>
      <h2 style={{ color: "#c9a473", textAlign: "center" }}>Admin Kontrollraum</h2>

      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ background: "rgba(20,20,20,0.8)", borderColor: "#5c4b37", marginBottom: "2rem" }}>
        <h3 style={{ color: "white", marginTop: 0 }}>Kampf-Steuerung</h3>
        
        <Group position="apart" mb="xs">
          <Text size="sm" color="#c9a473">Initiative-Reihenfolge (IDs und Gegner-Namen)</Text>
          <Button size="xs" variant="outline" color="green" onClick={handleAutoFillPlayers}>
            + Aktive Spieler einfügen
          </Button>
        </Group>

        <TextInput
          placeholder="z.B. char-123, Thresh, char-456, Elise"
          value={initiativeInput}
          onChange={(e) => setInitiativeInput(e.currentTarget.value)}
          styles={{ input: { background: "#2a2a2a", color: "white", borderColor: "#5c4b37" } }}
          mb="md"
        />

        <Group position="apart">
          <Button 
            style={{ background: "#c9a473", color: "#1a1a1a" }} 
            onClick={handleStartCombat}
          >
            Kampf Starten 
          </Button>

          <Button 
              variant="filled" 
              color="red" 
              onClick={handleEndCombat}
              disabled={!combatState?.inCombat}
            >
              Beenden
            </Button>
          
          <Group spacing="xs">
            <Button 
              variant="outline" 
              color="yellow" 
              onClick={handlePrevTurn}
              disabled={!combatState?.inCombat}
            >
              ⬅️
            </Button>
            <Button 
              variant="outline" 
              color="red" 
              onClick={handleNextTurn}
              disabled={!combatState?.inCombat}
            >
              ➡️
            </Button>
          </Group>
        </Group>

        {combatState?.inCombat && (
          <div style={{ marginTop: "1rem", padding: "1rem", background: "#1a1a1a", borderRadius: "8px", border: "1px solid #333" }}>
            <Text c="white" weight={600}>Aktueller Kampf (Runde {combatState.round})</Text>
            <Group spacing="xs" mt="xs">
              {combatState.turnOrder.map((entity, index) => (
                <Badge 
                  key={index} 
                  color={combatState.turnIndex === index ? "yellow" : "gray"}
                  variant={combatState.turnIndex === index ? "filled" : "outline"}
                >
                  {entity}
                </Badge>
              ))}
            </Group>
          </div>
        )}
      </Card>

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

      <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "2rem" }}>
        <Button variant="outline" color="gray" onClick={() => setCurrentView("selection")}>
          Zurück zur Auswahl
        </Button>
      </div>
    </div>
  );
}
