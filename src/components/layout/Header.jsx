import { useState } from "react";

export default function Header({ onSearch }) {
  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    setSearch(value);
    onSearch(value);
  };

  return (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '32px',
          fontWeight: '800',
          color: 'white',
          textAlign: 'center',
          letterSpacing: '-0.5px',
        }}>
          3D Asset Gallery
        </h1>
        
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
        }}>
          <input
            type="search"
            placeholder="Search 3D models..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '16px 52px 16px 24px',
              borderRadius: '50px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.9)',
              fontSize: '16px',
              fontWeight: '500',
              outline: 'none',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.background = 'white';
              e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.9)';
              e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            }}
          />
          
          <div style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#667eea',
            fontSize: '20px',
          }}>
            🔍
          </div>
        </div>
      </div>
    </header>
  );
}