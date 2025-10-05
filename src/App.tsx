import { useEffect, useState } from "react";
import AddPersonForm from "./components/AddPersonForm";
import Layout from "./components/Layout";

export default function App() {
  const [persons, setPersons] = useState<any[]>([]);

  const fetchPersons = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/persons");
      if (!res.ok) throw new Error("Failed to fetch persons");
      const data = await res.json();
      setPersons(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-4">
          ISM – Family Tree
        </h1>

        <AddPersonForm onPersonAdded={fetchPersons} />

        <h2 className="text-lg font-semibold mt-8 mb-2 text-indigo-800">
          Existing Persons
        </h2>
        <ul className="space-y-1">
          {persons.map((p) => (
            <li
              key={p.id}
              className="border-b border-indigo-100 pb-1 text-gray-800"
            >
              {p.givenName} {p.familyName} —{" "}
              <span className="text-sm text-gray-600">
                {p.gotra || "No Gotra"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
