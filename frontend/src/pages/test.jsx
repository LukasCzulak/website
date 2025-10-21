import React, { useEffect, useState } from "react";
import { getTests, createTest } from "../api/testService";

export function TestComponent() {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTests().then(setTests).catch(err => setError(err.message));
  }, []);

  const handleAdd = async () => {
    try {
      setError(null);
      await createTest({ testdata: "Neuer Eintrag" });
      const updated = await getTests();
      setTests(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Firestore Testdaten</h1>
      <button onClick={handleAdd}>Neuen Eintrag hinzufügen</button>
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      <ul>
        {tests.map((t) => (
          <li key={t.id}>{t.testdata}</li>
        ))}
      </ul>
    </div>
  );
}