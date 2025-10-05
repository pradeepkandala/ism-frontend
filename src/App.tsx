import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AddPersonForm from "./components/AddPersonForm";
import FamilyTreePage from "./pages/FamilyTreePage";

export default function App() {
  const [persons, setPersons] = useState([]);

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
    <Router>
      <div className="p-6 bg-gradient-to-br from-slate-50 to-indigo-100 min-h-screen">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">
            जय श्री कृष्ण 🦚 | ISM – Family Tree
          </h1>
          <nav>
            <Link to="/" className="mr-4 text-indigo-600 hover:underline">
              Home
            </Link>
            <Link to="/family-tree" className="text-indigo-600 hover:underline">
              View Tree
            </Link>
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <AddPersonForm onPersonAdded={fetchPersons} />

                <h2 className="text-lg font-semibold mt-8 mb-2 text-indigo-800">
                  Existing Persons
                </h2>
                <ul className="space-y-1">
                  {persons.map((p: any) => (
                    <li key={p.id} className="border-b border-indigo-100 pb-1 text-gray-800">
                      {p.givenName} {p.familyName} —{" "}
                      <span className="text-sm text-gray-600">
                        {p.gotra || "No Gotra"}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            }
          />
          <Route path="/family-tree" element={<FamilyTreePage />} />
        </Routes>
      </div>
    </Router>
  );
}
