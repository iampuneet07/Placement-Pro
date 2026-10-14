import React from 'react';

export default function LoadingSpinner({ text = 'Loading data from MongoDB...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        gap: '1rem',
      }}
    >
      <div className="spinner" style={{ width: '32px', height: '32px' }} />
      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
        {text}
      </span>
    </div>
  );
}
