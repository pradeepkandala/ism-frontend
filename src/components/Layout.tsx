import type { ReactNode } from "react";
import Footer from "./Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">
      {/* Header */}
      <header className="bg-blue-700 text-white text-center py-4 shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">
          जय श्री कृष्ण 🦚 | ISM – Indian Social Media
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        {children}
      </main>

      {/* Footer (separate component) */}
      <Footer />
    </div>
  );
}
