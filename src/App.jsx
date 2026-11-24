import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "./components/layout/Header";
import Container from "./components/layout/Container";
import ModelGrid from "./components/gallery/ModelGrid";
import ModelModal from "./components/gallery/ModelModal";
import { models as catalog } from "./data/models";
import { prepareModel, validateModelFile } from "./utils/modelFiles";
import { deleteUpload, loadUploads, saveUpload } from "./utils/uploadStore";

export default function App() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [uploads, setUploads] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loaded = [];

    loadUploads()
      .then((models) => {
        if (cancelled) {
          models.forEach((model) => URL.revokeObjectURL(model.file));
          return;
        }
        loaded = models;
        setUploads(models);
      })
      .catch(() => {
        if (!cancelled) {
          setUploadMessage("Saved models could not be opened in this browser.");
        }
      });

    return () => {
      cancelled = true;
      loaded.forEach((model) => URL.revokeObjectURL(model.file));
    };
  }, []);

  const gallery = useMemo(
    () => [...uploads, ...catalog].map(prepareModel),
    [uploads]
  );

  const normalizedQuery = query.trim().toLowerCase();
  const filteredModels = gallery.filter((model) => {
    if (!normalizedQuery) return true;
    return [model.name, model.description, model.category, model.rarity, model.fileName]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedQuery));
  });

  const closeModal = useCallback(() => setSelected(null), []);

  const handleUpload = useCallback(async (fileList) => {
    const files = [...fileList];
    const accepted = [];
    const rejected = [];

    files.forEach((file) => {
      const error = validateModelFile(file);
      if (error) rejected.push(`${file.name}: ${error}`);
      else accepted.push(file);
    });

    const created = [];
    for (const file of accepted) {
      try {
        created.push(await saveUpload(file));
      } catch {
        rejected.push(`${file.name}: could not be saved in this browser.`);
      }
    }

    if (created.length) {
      setUploads((current) => [...created, ...current]);
      setSelected(prepareModel(created[0]));
    }

    setUploadMessage(
      rejected.length
        ? rejected.join(" ")
        : created.length
          ? "Added. Drag in the viewer to look around, or download the file."
          : ""
    );
  }, []);

  const handleRemove = useCallback((model) => {
    setUploads((current) => current.filter((item) => item.id !== model.id));
    setSelected((current) => (current?.id === model.id ? null : current));
    const url = model.file;
    requestAnimationFrame(() => {
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    });
    deleteUpload(model.id).catch(() => {
      setUploadMessage("The model was hidden, but it could not be deleted from this browser.");
    });
  }, []);

  useEffect(() => {
    const onDragOver = (event) => {
      if (![...event.dataTransfer?.items || []].some((item) => item.kind === "file")) return;
      event.preventDefault();
      setDragging(true);
    };
    const onDragLeave = (event) => {
      if (event.relatedTarget) return;
      setDragging(false);
    };
    const onDrop = (event) => {
      if (!event.dataTransfer?.files?.length) return;
      event.preventDefault();
      setDragging(false);
      handleUpload(event.dataTransfer.files);
    };

    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, [handleUpload]);

  return (
    <>
      <Header onSearch={setQuery} onUpload={handleUpload} uploadMessage={uploadMessage} />

      <Container>
        <ModelGrid
          models={filteredModels}
          query={query}
          onSelect={setSelected}
          onRemove={handleRemove}
        />
      </Container>

      <ModelModal model={selected} onClose={closeModal} />

      {dragging && (
        <div className="drop-overlay" role="status">
          Drop the model to show it in 3D
        </div>
      )}
    </>
  );
}
