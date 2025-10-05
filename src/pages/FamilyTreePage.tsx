// src/pages/FamilyTreePage.tsx
import React from "react";
import FamilyTree from "../components/FamilyTree";

export default function FamilyTreePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <header className="bg-blue-700 text-white py-4 text-center shadow-md">
        <h1 className="text-3xl font-bold">🌿 Family Tree – ISM</h1>
      </header>

      <main className="flex-grow container mx-auto p-6">
        <FamilyTree />
      </main>

      <footer className="bg-blue-700 text-white text-center py-3 mt-auto">
        <p className="text-sm italic">
          “कर्मण्येवाधिकारस्ते मा फलेषु कदाचन” — You have the right to work,
          not to the fruits thereof.
        </p>
      </footer>
    </div>
  );
}
