import { useCallback, useState } from "react";
import Header from "./components/layout/Header";
import Container from "./components/layout/Container";
import ModelGrid from "./components/gallery/ModelGrid";
import ModelModal from "./components/gallery/ModelModal";
import { models } from "./data/models";

export default function App() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredModels = models.filter((model) => {
    if (!normalizedQuery) return true;
    return [model.name, model.description, model.category, model.rarity]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedQuery));
  });

  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <>
      <Header onSearch={setQuery} />

      <Container>
        <ModelGrid
          models={filteredModels}
          query={query}
          onSelect={setSelected}
        />
      </Container>

      <ModelModal model={selected} onClose={closeModal} />
    </>
  );
}
