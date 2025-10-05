import { useState, useEffect } from "react";

interface AddRelationshipFormProps {
  onRelationshipAdded: () => void;
}

export default function AddRelationshipForm({ onRelationshipAdded }: AddRelationshipFormProps) {
  const [persons, setPersons] = useState<any[]>([]);
  const [fromPersonId, setFromPersonId] = useState("");
  const [toPersonId, setToPersonId] = useState("");
  const [relType, setRelType] = useState("");
  const [directional, setDirectional] = useState(true);

  // Load persons for dropdowns
  useEffect(() => {
    fetch("http://localhost:8080/api/persons")
      .then((res) => res.json())
      .then(setPersons)
      .catch((err) => console.error("Error fetching persons:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromPersonId || !toPersonId || !relType) {
      alert("Please select both persons and a relationship type.");
      return;
    }

    const payload = {
      fromPersonId,
      toPersonId,
      relType,
      directional,
    };

    try {
      const res = await fetch("http://localhost:8080/api/relationships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create relationship");
      alert("🕊️ Relationship added successfully!");
      onRelationshipAdded();
      setFromPersonId("");
      setToPersonId("");
      setRelType("");
    } catch (err) {
      console.error(err);
      alert("Error adding relationship");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow bg-white mt-6">
      <h3 className="text-xl font-semibold text-indigo-700 mb-3">Add Relationship</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">From Person</label>
          <select
            className="w-full border p-2 rounded"
            value={fromPersonId}
            onChange={(e) => setFromPersonId(e.target.value)}
          >
            <option value="">Select Person</option>
            {persons.map((p) => (
              <option key={p.id} value={p.id}>
                {p.givenName} {p.familyName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">To Person</label>
          <select
            className="w-full border p-2 rounded"
            value={toPersonId}
            onChange={(e) => setToPersonId(e.target.value)}
          >
            <option value="">Select Person</option>
            {persons.map((p) => (
              <option key={p.id} value={p.id}>
                {p.givenName} {p.familyName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3">
        <label className="block text-sm text-gray-600 mb-1">Relationship Type</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          placeholder="e.g., Mother, Father, Spouse, Child"
          value={relType}
          onChange={(e) => setRelType(e.target.value)}
        />
      </div>

      <div className="mt-3 flex items-center space-x-2">
        <input
          type="checkbox"
          checked={directional}
          onChange={(e) => setDirectional(e.target.checked)}
        />
        <label className="text-sm text-gray-700">Directional relationship</label>
      </div>

      <button
        type="submit"
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Save Relationship
      </button>
    </form>
  );
}
