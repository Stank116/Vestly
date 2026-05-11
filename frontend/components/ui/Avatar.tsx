interface AvatarProps {
  initials: string;
  color: string;
  size?: number;
  fontSize?: number;
}

export default function Avatar({ initials, color, size = 38, fontSize = 13 }: AvatarProps) {
  return (
    <div
      className={`avatar ${color}`}
      style={{ width: size, height: size, fontSize }}
    >
      {initials}
    </div>
  );
}
