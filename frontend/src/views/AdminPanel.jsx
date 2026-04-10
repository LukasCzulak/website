import { useState } from "react";
import {
  Button,
  Card,
  Text,
  Group,
  Stack,
  Badge,
  TextInput,
  ScrollArea,
  Flex,
  Switch,
} from "@mantine/core";
import { updateHidden } from "../api/characterService";
import { useWebSocket } from "../utils/WebSocketContext";

export function AdminPanel({ setCurrentView, takenCharIds, allCharacters }) {
  const { stompClient, playerBrightness, combatState } = useWebSocket();

  const [initiativeInput, setInitiativeInput] = useState("");
  const [damage, setDamage] = useState({});
  const [heal, setHeal] = useState({});

  const handleDimAll = () => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/topic/puzzle/dim",
        body: "dim_lights",
      });
    }
  };

  const handleStartCombat = () => {
    if (stompClient && stompClient.connected && initiativeInput.trim() !== "") {
      const order = initiativeInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      stompClient.publish({
        destination: "/app/combat/start",
        body: JSON.stringify(order),
      });
    }
  };

  const handleNextTurn = () => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/combat/nextTurn",
        body: "",
      });
    }
  };

  const handlePrevTurn = () => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/combat/prevTurn",
        body: "",
      });
    }
  };

  const handleEndCombat = () => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/combat/end",
        body: "",
      });
    }
  };

  const handleDealDmg = (dmg, champ) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/combat/dmg",
        body: JSON.stringify({
          dmg,
          champ,
        }),
      });
    }
  };

  const handleHeal = (heal, champ) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/combat/heal",
        body: JSON.stringify({
          heal,
          champ,
        }),
      });
    }
  };

  const handleAutoFillPlayers = () => {
    if (!takenCharIds || !allCharacters) return;

    const playerNames = takenCharIds
      .map((id) => {
        const char = allCharacters.find((c) => c.id === id);
        if (char && char.name) {
          return char.name.charAt(0).toUpperCase() + char.name.slice(1);
        }
        return "";
      })
      .filter((name) => name !== "");

    const existing = initiativeInput ? initiativeInput + ", " : "";
    setInitiativeInput(existing + playerNames.join(", "));
  };

  const playersAtZenith = Object.entries(playerBrightness).filter(
    ([user, val]) => Math.round(val) === 100,
  );

  const players = {
    Elias: "Illaoi",
    Sabrina: "Miss Fortune",
    Vera: "Nami",
    Giorgia: "Nilah",
    Kelly: "Pyke",
    Colin: "Twisted Fate",
    Katharina: "Katarina",
    Annika: "Akshan",
  };

  const [hiddenState, setHiddenState] = useState({});

  const setHidden = (hiddenKey, champ, checked) => {
    const character = allCharacters.find(
      (c) => c.name.toLowerCase() === champ.toLowerCase(),
    );

    if (!character) return;

    const updatedCharacter = {
      ...character,
    };

    if (hiddenKey === "hidden_1") {
      updatedCharacter.abilities.hidden_1.activated = checked;
    } else {
      updatedCharacter.abilities.hidden_2.activated = checked;
    }

    updateHidden(updatedCharacter);
  };

  return (
    <div
      style={{
        padding: "2rem",
        zIndex: 0,
        maxWidth: "100vw",
        margin: "-5rem auto 0 auto",
        textAlign: "left",
        maxHeight: "100vh",
      }}
    >
      <h2 style={{ color: "#c9a473", textAlign: "center" }}>
        Admin Kontrollraum
      </h2>

      <Flex direction="row" gap="xl" justify="center">
        <Card
          w="40vw"
          h="80vh"
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          style={{
            background: "rgba(20,20,20,0.8)",
            borderColor: "#5c4b37",
            marginBottom: "2rem",
          }}
        >
          <h3 style={{ color: "white", marginTop: 0 }}>Spielerverwaltung</h3>
          <ScrollArea h="70vh">
            {Object.entries(players).map(([name, champ]) => (
              <Card
                key={name}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  background: "rgba(20,20,20,0.8)",
                  borderColor: "#5c4b37",
                  marginBottom: "2rem",
                }}
              >
                <Text component="div" c="white" size="lg">
                  {name} - {champ}
                  <Flex direction="row" align="center" gap="xl" mb="10px">
                    <TextInput
                      c="red"
                      label="Damage"
                      placeholder="Damage"
                      value={damage[champ] || ""}
                      onChange={(e) =>
                        setDamage((prev) => ({
                          ...prev,
                          [champ]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const dmgInt = parseInt(damage[champ], 10);

                          if (!isNaN(dmgInt)) {
                            handleDealDmg(dmgInt, champ);

                            setDamage((prev) => ({
                              ...prev,
                              [champ]: "",
                            }));
                          }
                        }
                      }}
                    />
                    <TextInput
                      c="green"
                      label="Heal"
                      placeholder="Heal"
                      value={heal[champ] || ""}
                      onChange={(e) =>
                        setHeal((prev) => ({
                          ...prev,
                          [champ]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const healInt = parseInt(heal[champ], 10);

                          if (!isNaN(healInt)) {
                            handleHeal(healInt, champ);

                            setHeal((prev) => ({
                              ...prev,
                              [champ]: "",
                            }));
                          }
                        }
                      }}
                    />
                  </Flex>
                  <Flex direction="row" align="center" gap="xl" mb="10px">
                    <Switch
                      checked={hiddenState[champ]?.hidden_1 || false}
                      onChange={(event) => {
                        const isChecked = event.currentTarget.checked;

                        setHiddenState((prev) => ({
                          ...prev,
                          [champ]: {
                            ...prev[champ],
                            hidden_1: isChecked,
                          },
                        }));

                        setHidden("hidden_1", champ, isChecked);
                      }}
                      label="Hidden 1"
                    />
                    <Switch
                      checked={hiddenState[champ]?.hidden_2 || false}
                      onChange={(event) => {
                        const isChecked = event.currentTarget.checked;

                        setHiddenState((prev) => ({
                          ...prev,
                          [champ]: {
                            ...prev[champ],
                            hidden_2: isChecked,
                          },
                        }));

                        setHidden("hidden_2", champ, isChecked);
                      }}
                      label="Hidden 2"
                    />
                    <Button
                      size="compact-sm"
                      style={{ background: "#c9a473", color: "#1a1a1a" }}
                    >
                      give cue
                    </Button>
                  </Flex>
                </Text>
              </Card>
            ))}
          </ScrollArea>
        </Card>
        <div>
          <ScrollArea h="80vh">
            <Card
              w="40vw"
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                background: "rgba(20,20,20,0.8)",
                borderColor: "#5c4b37",
                marginBottom: "2rem",
              }}
            >
              <h3 style={{ color: "white", marginTop: 0 }}>Kampf-Steuerung</h3>

              <Group position="apart" mb="xs">
                <Text size="sm" color="#c9a473">
                  Initiative-Reihenfolge (IDs und Gegner-Namen)
                </Text>
                <Button
                  size="xs"
                  variant="outline"
                  color="green"
                  onClick={handleAutoFillPlayers}
                >
                  + Aktive Spieler einfügen
                </Button>
              </Group>

              <TextInput
                placeholder="z.B. char-123, Thresh, char-456, Elise"
                value={initiativeInput}
                onChange={(e) => setInitiativeInput(e.currentTarget.value)}
                styles={{
                  input: {
                    background: "#2a2a2a",
                    color: "white",
                    borderColor: "#5c4b37",
                  },
                }}
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
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    background: "#1a1a1a",
                    borderRadius: "8px",
                    border: "1px solid #333",
                  }}
                >
                  <Text c="white" weight={600}>
                    Aktueller Kampf (Runde {combatState.round})
                  </Text>
                  <Group spacing="xs" mt="xs">
                    {combatState.turnOrder.map((entity, index) => (
                      <Badge
                        key={index}
                        color={
                          combatState.turnIndex === index ? "yellow" : "gray"
                        }
                        variant={
                          combatState.turnIndex === index ? "filled" : "outline"
                        }
                      >
                        {entity}
                      </Badge>
                    ))}
                  </Group>
                </div>
              )}
            </Card>

            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                background: "rgba(20,20,20,0.8)",
                borderColor: "#5c4b37",
              }}
            >
              <h3 style={{ color: "white", marginTop: 0 }}>
                Sonnen-Schrein Rätsel
              </h3>

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
                <Text c="dimmed" fs="italic">
                  Aktuell niemand am Zenit.
                </Text>
              ) : (
                <Stack spacing="xs">
                  {playersAtZenith.map(([user, val]) => (
                    <Group key={user} position="apart">
                      <Text c="white">{user}</Text>
                      <Badge color="yellow" variant="filled">
                        Hat 100% !
                      </Badge>
                    </Group>
                  ))}
                </Stack>
              )}

              <div
                style={{
                  marginTop: "2rem",
                  borderTop: "1px solid #5c4b37",
                  paddingTop: "1rem",
                }}
              >
                <Text weight={600} c="#c9a473" mb="xs">
                  Live-Übersicht aller Matrosen:
                </Text>
                {Object.entries(playerBrightness).map(([user, val]) => (
                  <Group key={user} position="apart">
                    <Text c="dimmed" size="sm">
                      {user}
                    </Text>
                    <Text c="dimmed" size="sm">
                      {Math.round(val)}%
                    </Text>
                  </Group>
                ))}
                {Object.keys(playerBrightness).length === 0 && (
                  <Text c="dimmed" size="sm">
                    Noch keine Daten von Spielern empfangen.
                  </Text>
                )}
              </div>
            </Card>

            <div
              style={{
                textAlign: "center",
                marginTop: "2rem",
                marginBottom: "2rem",
              }}
            >
              <Button
                variant="outline"
                color="gray"
                onClick={() => setCurrentView("selection")}
              >
                Zurück zur Auswahl
              </Button>
            </div>
          </ScrollArea>
        </div>
      </Flex>
    </div>
  );
}
