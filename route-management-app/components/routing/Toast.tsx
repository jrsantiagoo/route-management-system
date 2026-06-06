"use client";
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onDismiss: () => void;
  durationMs?: number;
}

export default function Toast({ message, onDismiss, durationMs = 3000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(t);
  }, [onDismiss, durationMs]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        background: '#1f2937',
        color: '#fff',
        padding: '10px 18px',
        borderRadius: '6px',
        fontSize: '14px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <span style={{ color: '#4ade80', fontWeight: 700 }}>✓</span>
      {message}
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          fontSize: '18px',
          lineHeight: 1,
          padding: 0,
          marginLeft: '4px',
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
