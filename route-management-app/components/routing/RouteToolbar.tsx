"use client";

interface RouteToolbarProps {
  isEditMode: boolean;
  onToggleEdit: () => void;
  onSuggestRoutes: () => void;
  onSave: () => void;
}

export default function RouteToolbar({
  isEditMode,
  onToggleEdit,
  onSuggestRoutes,
  onSave,
}: RouteToolbarProps) {
  const baseBtn: React.CSSProperties = {
    padding: '6px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    background: '#fff',
    color: '#374151',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        minHeight: '48px',
        flexShrink: 0,
      }}
    >
      <button
        onClick={onToggleEdit}
        style={{
          ...baseBtn,
          background: isEditMode ? '#374151' : '#fff',
          color: isEditMode ? '#fff' : '#374151',
          border: `1px solid ${isEditMode ? '#374151' : '#d1d5db'}`,
        }}
      >
        {isEditMode ? 'Done Editing' : 'Edit'}
      </button>

      <button onClick={onSuggestRoutes} style={baseBtn}>
        Suggest Routes
      </button>

      <button
        onClick={onSave}
        title="Save route"
        style={{ ...baseBtn, padding: '6px 10px', display: 'flex', alignItems: 'center' }}
        aria-label="Save route"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      </button>
    </div>
  );
}
