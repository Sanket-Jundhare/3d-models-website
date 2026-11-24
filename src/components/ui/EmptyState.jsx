export default function EmptyState({ 
  message = "No models found",
  searchQuery = ""
}) {
  return (
    <div style={{
      textAlign: "center",
      padding: "60px 20px",
    }}>
      <div style={{
        fontSize: "72px",
        marginBottom: "20px",
        color: "#e2e8f0",
      }}>
        🎨
      </div>
      
      <h3 style={{
        fontSize: "24px",
        fontWeight: "600",
        color: "#475569",
        marginBottom: "12px",
      }}>
        {message}
      </h3>
      
      {searchQuery && (
        <p style={{
          color: "#64748b",
          fontSize: "16px",
          marginBottom: "20px",
        }}>
          No results for "<strong style={{ color: "#3b82f6" }}>{searchQuery}</strong>"
        </p>
      )}
      
      <p style={{
        color: "#94a3b8",
        fontSize: "14px",
      }}>
        Try a different name, category, or rarity
      </p>
    </div>
  );
}