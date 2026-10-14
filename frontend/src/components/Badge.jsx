import React from 'react';

export default function Badge({ variant = 'gray', children, className = '' }) {
  const variantClass = `badge-${variant.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
