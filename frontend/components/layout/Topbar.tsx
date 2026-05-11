import { ReactNode } from 'react';

interface TopbarProps {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
}

export default function Topbar({ title, left, right }: TopbarProps) {
  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {left ?? (title && <div className="page-heading">{title}</div>)}
      </div>
      {right && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {right}
        </div>
      )}
    </div>
  );
}
