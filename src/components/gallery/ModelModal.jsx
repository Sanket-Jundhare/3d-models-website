import { useEffect } from "react";
import Scene from "../three/Scene";
import ModelErrorBoundary from "../ui/ModelErrorBoundary";
import { downloadModel } from "../../utils/modelFiles";

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
          <div className="modal-info-row">
            <div>
              <h2>{model.name}</h2>
              <p>{model.description}</p>
              {model.category && <span className="tag">{model.category}</span>}
              {model.rarity && <span className="tag">{model.rarity}</span>}
            </div>
            <button
              className="download-btn"
              type="button"
              onClick={() => downloadModel(model)}
            >
              Download {model.fileName || "model"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
