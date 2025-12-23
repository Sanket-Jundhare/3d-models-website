export default function Container({ 
  children, 
  className = "", 
  maxWidth = "1400px",
  padding = true,
  centered = true,
  fullWidth = false 
}) {
  return (
    <main 
      className={`container ${className}`}
      style={{
        width: '100%',
        maxWidth: fullWidth ? '100%' : maxWidth,
        margin: centered ? '0 auto' : '0',
        padding: padding ? 'clamp(16px, 4vw, 32px)' : '0',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </main>
  );
}