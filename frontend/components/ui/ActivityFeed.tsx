import { ActivityItem } from '@/types';

interface ActivityFeedProps {
  items: ActivityItem[];
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="card" style={{ padding: '4px 16px' }}>
      {items.map((item, i) => (
        <div className="activity-item" key={i}>
          <div className="act-dot" style={{ background: item.color }} />
          <div>
            <div className="act-text">{item.text}</div>
            <div className="act-time">{item.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
