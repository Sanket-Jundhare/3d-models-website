import Scene from "../three/Scene";

export default function ModelModal({ model, onClose }) {
  if (!model) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* BIG 3D VIEW */}
        <div className="modal-canvas">
          <Scene file={model.file} />
        </div>

        {/* INFO */}
        <div className="modal-info">
          <h2>{model.name}</h2>
          <p>{model.description}</p>
          {model.category && (
            <span className="tag">{model.category}</span>
          )}
        </div>
      </div>
    </div>
  );
}
