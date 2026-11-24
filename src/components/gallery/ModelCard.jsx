import { useEffect, useRef, useState } from "react";
import Scene from "../three/Scene";
import ModelErrorBoundary from "../ui/ModelErrorBoundary";
import { downloadModel } from "../../utils/modelFiles";
import { usePreviewSlot } from "../../utils/previewSlots";

export default function ModelCard({ model, onClick, onRemove }) {
  const previewRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const node = previewRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "40px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const showPreview = usePreviewSlot(model.id, inView);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div 
      className="card"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      {/* Card Preview Section */}
      <div 
        className="card-preview"
        style={{
          position: 'relative',
          height: '200px',
          overflow: 'hidden',
          background: '#f5f7fa',
        }}
      >
        {/* 3D Model — mounted only while the card is near the viewport */}
        <div ref={previewRef} style={{ width: '100%', height: '100%' }}>
          {showPreview ? (
            <ModelErrorBoundary key={model.file}>
              <Scene file={model.file} preview />
            </ModelErrorBoundary>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              Open to view in 3D
            </div>
          )}
        </div>
        
        {/* Hover Overlay */}
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <div
              style={{
                color: 'white',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              👁️ Quick View
            </div>
          </div>
        )}
        
        {model.category && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              backdropFilter: 'blur(4px)',
            }}
          >
            {model.category}
          </div>
        )}
        
        {/* Like Button */}
        <button
          onClick={handleLikeClick}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px',
            color: isLiked ? '#ef4444' : '#666',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
        >
          {isLiked ? '❤️' : '🤍'}
        </button>
      </div>
      
      {/* Card Content Section */}
      <div 
        className="card-info"
        style={{
          padding: '16px',
        }}
      >
        {/* Title */}
        <h3
          style={{
            margin: '0 0 8px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={model.name}
        >
          {model.name}
        </h3>
        
        {(model.downloads != null || model.likes != null) && (
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '12px',
              fontSize: '14px',
              color: '#6b7280',
            }}
          >
            {model.downloads != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>📥</span>
                <span>{model.downloads} downloads</span>
              </div>
            )}
            {model.likes != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>❤️</span>
                <span>{model.likes} likes</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {model.description && (
          <p
            style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              color: '#6b7280',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '40px',
            }}
          >
            {model.description}
          </p>
        )}
        
        {/* Metadata Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            paddingTop: '12px',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          {/* Polygon Count */}
          {model.polygons && (
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#059669',
                background: '#d1fae5',
                padding: '4px 10px',
                borderRadius: '12px',
              }}
            >
              {model.polygons.toLocaleString()} polys
            </div>
          )}
          
          {/* File Formats */}
          {model.formats && model.formats.length > 0 && (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {model.formats.slice(0, 2).map((format, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: '11px',
                    color: '#4b5563',
                    background: '#f3f4f6',
                    padding: '2px 8px',
                    borderRadius: '10px',
                  }}
                >
                  {format}
                </span>
              ))}
              {model.formats.length > 2 && (
                <span
                  style={{
                    fontSize: '11px',
                    color: '#3058a7ff',
                    padding: '2px 6px',
                  }}
                >
                  +{model.formats.length - 2}
                </span>
              )}
            </div>
          )}

          <div className="model-actions">
            <button
              type="button"
              className="download-btn"
              onClick={(event) => {
                event.stopPropagation();
                downloadModel(model);
              }}
            >
              Download
            </button>
            {model.uploaded && (
              <button
                type="button"
                className="remove-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  onRemove?.(model);
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Hover Effect */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .card-preview {
          transition: transform 0.5s ease;
        }
        
        .card:hover .card-preview {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}