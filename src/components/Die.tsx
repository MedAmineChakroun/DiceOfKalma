import './Die.css';

const PIP_LAYOUT: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
};

/** Flat face tint per pip value — more color, no gradients */
const FACE_COLORS: Record<number, string> = {
  1: '#3498db',
  2: '#9b59b6',
  3: '#2ecc71',
  4: '#e67e22',
  5: '#e74c3c',
  6: '#1abc9c',
};

interface Props {
  value: number;
  index: number;
  selected: boolean;
  rolling?: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function Die({ value, index, selected, rolling, onToggle, disabled }: Props) {
  const rotation = ((index * 7) % 11) - 5;
  const pips = PIP_LAYOUT[value] ?? [];
  const faceColor = FACE_COLORS[value] ?? 'var(--cream)';

  return (
    <button
      type="button"
      className={[
        'die',
        selected && 'die-selected',
        rolling && 'die-rolling',
        disabled && 'die-disabled',
      ].filter(Boolean).join(' ')}
      style={{
        '--die-rotation': `${rotation}deg`,
        '--face-color': faceColor,
      } as React.CSSProperties}
      onClick={onToggle}
      disabled={disabled}
      aria-label={`Die ${index + 1}, value ${value}${selected ? ', selected' : ''}`}
      aria-pressed={selected}
    >
      <span className="die-inner">
        <span className="die-face">
          {pips.map(([row, col], i) => (
            <span
              key={i}
              className="die-pip"
              style={{ gridRow: row + 1, gridColumn: col + 1 }}
            />
          ))}
        </span>
      </span>
      <span className="die-index">{index + 1}</span>
    </button>
  );
}
