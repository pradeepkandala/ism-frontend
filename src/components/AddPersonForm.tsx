import React, { useState } from "react";

export default function AddPersonForm({ onPersonAdded }: { onPersonAdded: () => void }) {
  const [formData, setFormData] = useState({
    givenName: "",
    middleName: "",
    familyName: "",
    gender: "",
    gotra: "",
    occupation: "",
    birthplace: "",
    birthDate: "",
    religion: "",
    caste: "",
    subCaste: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add person");
      }

      setMessage("✅ Person added successfully!");
      setFormData({
        givenName: "",
        middleName: "",
        familyName: "",
        gender: "",
        gotra: "",
        occupation: "",
        birthplace: "",
        birthDate: "",
        religion: "",
        caste: "",
        subCaste: "",
      });
      onPersonAdded(); // refresh the list
    } catch (err: any) {
      setMessage("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mt-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-center text-indigo-700 mb-4">Add a New Person</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type={key === "birthDate" ? "date" : "text"}
            name={key}
            value={(formData as any)[key]}
            onChange={handleChange}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-all"
        >
          {loading ? "Adding..." : "Add Person"}
        </button>
      </form>

      {message && <p className="text-center mt-3 text-sm">{message}</p>}
    </div>
  );
}
