import { useEffect, useState } from "react";
import { PersonApi } from "../api/personApi";
import type { Person } from "../models/Person";

export default function PersonList() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const data = await PersonApi.getAll();
        setPersons(data);
      } catch (err: any) {
        setError("Failed to fetch persons");
        console.error("Error fetching persons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersons();
  }, []);

  if (loading) return <p className="text-gray-500 p-6">Loading...</p>;
  if (error) return <p className="text-red-600 p-6">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        👨‍👩‍👧‍👦 Person List
      </h1>

      {persons.length === 0 ? (
        <p className="text-gray-500">No persons found. Add someone to begin!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left px-4 py-2 font-semibold">Name</th>
                <th className="text-left px-4 py-2 font-semibold">Gender</th>
                <th className="text-left px-4 py-2 font-semibold">Gotra</th>
                <th className="text-left px-4 py-2 font-semibold">Occupation</th>
                <th className="text-left px-4 py-2 font-semibold">Birthplace</th>
              </tr>
            </thead>
            <tbody>
              {persons.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {p.givenName} {p.middleName ?? ""} {p.familyName ?? ""}
                  </td>
                  <td className="px-4 py-2">{p.gender ?? "-"}</td>
                  <td className="px-4 py-2">{p.gotra ?? "-"}</td>
                  <td className="px-4 py-2">{p.occupation ?? "-"}</td>
                  <td className="px-4 py-2">{p.birthplace ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
