import Die from './Die';

interface Props {
  dice: number[];
  selected: Set<number>;
  rolling: Set<number>;
  onToggle: (index: number) => void;
  disabled?: boolean;
}

export default function DiceTray({ dice, selected, rolling, onToggle, disabled }: Props) {
  return (
    <div className="dice-tray">
      {dice.map((value, i) => (
        <Die
          key={i}
          value={value}
          index={i}
          selected={selected.has(i)}
          rolling={rolling.has(i)}
          onToggle={() => onToggle(i)}
          disabled={disabled || rolling.size > 0}
        />
      ))}
    </div>
  );
}
