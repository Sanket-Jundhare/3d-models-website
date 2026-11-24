import { useEffect } from "react";
import Scene from "../three/Scene";
import ModelErrorBoundary from "../ui/ModelErrorBoundary";

export default function ModelModal({ model, onClose }) {
  useEffect(() => {
    if (!model) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [model, onClose]);

  if (!model) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" type="button" aria-label="Close" onClick={onClose}>
          ✕
        </button>

        {/* BIG 3D VIEW */}
        <div className="modal-canvas">
          <ModelErrorBoundary key={model.file}>
            <Scene file={model.file} />
          </ModelErrorBoundary>
        </div>

        {/* INFO */}
        <div className="modal-info">
          <h2>{model.name}</h2>
          <p>{model.description}</p>
          {model.category && <span className="tag">{model.category}</span>}
          {model.rarity && <span className="tag">{model.rarity}</span>}
        </div>
      </div>
    </div>
  );
}
