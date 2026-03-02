import { useState } from "react";
import { Switch, Slider, Text, Stack, Group } from "@mantine/core";

import { IconAlertTriangle } from "@tabler/icons-react";

export function SettingsView({ 
  initialLowPower,
  initialLimit,
  initialLoops,
  initialInitial,
  onCancel,
  onApply
}) {
  // save unsaved changes
  const [lowPower, setLowPower] = useState(initialLowPower);
  const [limit, setLimit] = useState(initialLimit);
  const [loops, setLoops] = useState(initialLoops);
  const [initialParticles, setInitialParticles] = useState(initialInitial);

  const calculatePerformance = () => {
    if (lowPower) {
      return 0;
    }
    return limit + 10 * loops + initialParticles / 4;
  };

  return (
    <div className="stats-overlay">
      <div className="stats-modal" style={{ maxWidth: '550px' }}> 
        
        <div className="stats-header" style={{ paddingBottom: '15px' }}>
          <div className="stats-title-group">
            <h2>Grafik & Leistung</h2>
            <span className="stats-title">Passe das Schiff an dein Gerät an</span>
          </div>
        </div>

        <div className="stats-body" style={{ textAlign: "left", color: "#c9a473", padding: "10px 0" }}>
          
          <Stack spacing="xl">
            <Group position="apart">
              <div>
                <Text size="lg" weight={600}>Sparmodus (Animationen aus)</Text>
                <Text size="sm" c="dimmed" style={{ color: "#c9a473" }}>Empfohlen für ältere Handys</Text>
              </div>
              <Switch
                checked={lowPower}
                onChange={(e) => setLowPower(e.currentTarget.checked)}
                size="lg"
                color="#c9a473"
              />
            </Group>

            <div>
              <Group position="apart" mb="xs">
                <Text weight={500}>Maximale Partikelanzahl</Text>
                <Text weight={700} c="#c9a473">{limit}</Text>
              </Group>
              <Slider
                value={limit}
                onChange={setLimit}
                min={1}
                max={100}
                disabled={lowPower}
                color="orange"
                marks={[
                  { value: 20, label: 'Normal' },
                  { value: 100, label: 'Max' }
                ]}
              />
            </div>

            <div style={{ marginTop: '15px' }}>
              <Group position="apart" mb="xs">
                <Text weight={500}>Nebel Spawner</Text>
                <Text weight={700} c="#c9a473">{loops}</Text>
              </Group>
              <Slider
                value={loops}
                onChange={setLoops}
                min={1}
                max={20}
                disabled={lowPower}
                color="orange"
                marks={[
                  { value: 3, label: 'Normal' },
                  { value: 20, label: 'Max' }
                ]}
              />
            </div>

            <div style={{ marginTop: '15px' }}>
              <Group position="apart" mb="xs">
                <Text weight={500}>Start-Partikel beim Laden</Text>
                <Text weight={700} c="#c9a473">{initialParticles}</Text>
              </Group>
              <Slider
                value={initialParticles}
                onChange={setInitialParticles}
                min={1}
                max={100}
                disabled={lowPower}
                color="orange"
                marks={[
                  { value: 5, label: 'Normal' },
                  { value: 100, label: 'Max' }
                ]}
              />
            </div>
          </Stack>
        </div>

        {!lowPower && calculatePerformance () >= 100 && (
          <div>
            <IconAlertTriangle size={32} />
            <Text> Warnung: Aktuelle Einstellungen könnten Ihr Gerät verlangsamen! </Text>
          </div>
        )}

        <div className="stats-footer" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
          <button 
            className="pirate-btn" 
            style={{ background: '#8b0000', color: 'white' }} 
            onClick={onCancel}
          >
            Abbrechen
          </button>
          
          <button 
            className="pirate-btn" 
            onClick={() => onApply(lowPower, limit, loops, initialParticles)}
          >
            Übernehmen
          </button>
        </div>

      </div>
    </div>
  );
}
