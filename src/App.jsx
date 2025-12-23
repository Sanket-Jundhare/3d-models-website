import { useState } from "react";
import Header from "./components/layout/Header";
import Container from "./components/layout/Container";
import ModelGrid from "./components/gallery/ModelGrid";
import ModelModal from "./components/gallery/ModelModal";
import { models } from "./data/models";

export default function App() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  const filteredModels = models.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Header onSearch={setQuery} />

      <Container>
        <ModelGrid models={filteredModels} onSelect={setSelected} />
      </Container>

      <ModelModal model={selected} onClose={() => setSelected(null)} />
    </>
  );
}
