import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";

// register dagre layout
cytoscape.use(dagre);

type Person = {
  id: string;
  givenName?: string;
  familyName?: string;
};

type Relationship =
  | { id: string; relType: string; fromPersonId: string; toPersonId: string } // flat DTO
  | {
      id: string;
      relType: string;
      fromPerson: { id: string };
      toPerson: { id: string };
    }; // nested entity

export default function FamilyTreePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cy: cytoscape.Core | null = null;

    const boot = async () => {
      try {
        const [personsRes, relationshipsRes] = await Promise.all([
          fetch("http://localhost:8080/api/persons"),
          fetch("http://localhost:8080/api/relationships"),
        ]);

        const persons: Person[] = await personsRes.json();
        const relationships: Relationship[] = await relationshipsRes.json();

        // Build nodes
        const nodes = persons.map((p) => ({
          data: {
            id: p.id,
            label: `${p.givenName ?? ""} ${p.familyName ?? ""}`.trim() || p.id,
          },
        }));

        // Build edges (handles both flat and nested shapes)
        const edges = relationships
          .map((r) => {
            const rel: any = r as any;
            const source =
              rel.fromPersonId ?? rel.fromPerson?.id ?? undefined;
            const target =
              rel.toPersonId ?? rel.toPerson?.id ?? undefined;

            if (!source || !target) return null; // skip malformed rows
            return {
              data: {
                id: `${source}->${target}-${rel.id ?? Math.random()}`,
                source,
                target,
                label: rel.relType,
              },
            };
          })
          .filter(Boolean) as cytoscape.ElementDefinition[];

        // Fallback demo if API empty (so you always see a graph)
        const elements =
          nodes.length === 0
            ? [
                { data: { id: "A", label: "Demo Father" } },
                { data: { id: "B", label: "Demo Mother" } },
                { data: { id: "C", label: "Demo Child" } },
                { data: { id: "U", label: "👨‍👩‍👧" } },
                { data: { id: "A->U", source: "A", target: "U", label: "Father" } },
                { data: { id: "B->U", source: "B", target: "U", label: "Mother" } },
                { data: { id: "U->C", source: "U", target: "C", label: "Child" } },
              ]
            : [...nodes, ...edges];

        if (!containerRef.current) return;

        cy = cytoscape({
          container: containerRef.current,
          elements,
          style: [
            {
              selector: "node",
              style: {
                label: "data(label)",
                "background-color": "#4f46e5",
                color: "#fff",
                "text-valign": "center",
                "text-halign": "center",
                "font-size": "12px",
                "text-outline-width": 2,
                "text-outline-color": "#4f46e5",
                shape: "round-rectangle",
                width: "label",
                padding: "10px",
                "border-width": 2,
                "border-color": "#a5b4fc",
              },
            },
            {
              selector: "node[label = '👨‍👩‍👧']",
              style: {
                "background-color": "#16a34a",
                "text-outline-color": "#16a34a",
                "font-size": "18px",
                width: "40px",
                height: "40px",
              },
            },
            {
              selector: "edge",
              style: {
                width: "2",
                "line-color": "#6366f1",
                "target-arrow-color": "#6366f1",
                "target-arrow-shape": "triangle",
                "curve-style": "bezier",
                label: "data(label)",
                "font-size": "10px",
                "text-background-color": "#fff",
                "text-background-opacity": 0.9,
                "text-background-padding": "2px",
                "text-rotation": "autorotate",
              },
            },
          ],
          layout: {
            name: "dagre",
            rankDir: "TB", // top -> bottom
            nodeSep: 100,
            rankSep: 140,
            edgeSep: 60,
            fit: true,
          } as any,
        });

        cy.resize();
        cy.fit();
      } catch (e) {
        console.error("Tree render error:", e);
      }
    };

    boot();
    return () => {
      if (cy) cy.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <header className="bg-blue-700 text-white py-4 text-center shadow-md">
        <h1 className="text-2xl font-bold">🌿 ISM – Family Tree</h1>
      </header>

      <main className="container mx-auto p-4 flex-1">
        <div
          ref={containerRef}
          className="w-full h-[78vh] bg-white rounded-xl shadow border"
        />
      </main>

      <footer className="bg-blue-700 text-white text-center py-3">
        <p className="text-sm italic">
          “कर्मण्येवाधिकारस्ते मा फलेषु कदाचन”
        </p>
      </footer>
    </div>
  );
}
