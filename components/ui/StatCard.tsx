interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
  valueColor?: string;
}

export default function StatCard({ label, value, sub, subColor = 'var(--text3)', valueColor }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </div>
      {sub && <div className="stat-sub" style={{ color: subColor }}>{sub}</div>}
    </div>
  );
}
