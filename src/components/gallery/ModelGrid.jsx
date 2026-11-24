import ModelCard from "./ModelCard";
import EmptyState from "../ui/EmptyState";

export default function ModelGrid({ models, query = "", onSelect, onRemove }) {
  if (!models.length) return <EmptyState searchQuery={query.trim()} />;

  return (
    <>
      <style>
        {`
        .model-grid-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .model-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 16px;
        }
        
        .model-grid-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .model-grid-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
        }
        
        .model-grid-count {
          font-size: 16px;
          color: #718096;
          background: #f7fafc;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 500;
        }

        @media (prefers-color-scheme: dark) {
          .model-grid-title {
            color: #f8fafc;
          }

          .model-grid-count {
            color: #e2e8f0;
            background: rgba(255, 255, 255, 0.12);
          }
        }
        
        .model-grid-empty {
          text-align: center;
          padding: 60px 20px;
          background: linear-gradient(135deg, #f6f9fc 0%, #edf2f7 100%);
          border-radius: 16px;
          border: 2px dashed #cbd5e0;
          margin: 40px 0;
        }
        
        .model-grid-empty-title {
          font-size: 24px;
          color: #2d3748;
          margin-bottom: 12px;
        }
        
        .model-grid-empty-text {
          color: #718096;
          max-width: 400px;
          margin: 0 auto 24px;
          line-height: 1.5;
        }
        
        /* Loading animation */
        .model-grid-loading {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        
        .model-grid-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: model-grid-shimmer 1.5s infinite;
          border-radius: 16px;
          height: 400px;
        }
        
        @keyframes model-grid-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .model-grid-container {
            padding: 16px;
          }
          
          .model-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 16px;
          }
          
          .model-grid-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .model-grid-title {
            font-size: 24px;
          }
        }
        
        @media (max-width: 480px) {
          .model-grid {
            grid-template-columns: 1fr;
          }
        }
        `}
      </style>

      <div className="model-grid-container">
        <div className="model-grid-header">
          <h2 className="model-grid-title">3D Models Library</h2>
          <div 
            className="model-grid-count"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>📦</span>
            <span>{models.length} {models.length === 1 ? 'Model' : 'Models'}</span>
          </div>
        </div>

        <div className="model-grid">
          {models.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onClick={() => onSelect(model)}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>
    </>
  );
}