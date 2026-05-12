import { ReactNode } from 'react';

interface TopbarProps {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
}

export default function Topbar({ title, left, right }: TopbarProps) {
  return (
    <div className="topbar">
      <div className="topbar-main">
        {left ?? (title && <div className="page-heading">{title}</div>)}
      </div>
      {right && (
        <div className="topbar-actions">
          {right}
        </div>
      )}
    </div>
  );
}
