import { Relic } from '../game/relics';
import RelicCard from './RelicCard';
import './RelicPicker.css';

interface Props {
  choices: Relic[];
  onPick: (relic: Relic) => void;
}

export default function RelicPicker({ choices, onPick }: Props) {
  return (
    <div className="relic-picker-overlay">
      <div className="relic-picker cartoon-panel bounce-in">
        <h2 className="cartoon-subtitle picker-title">Choose a Skull Relic!</h2>
        <p className="picker-sub">Level up — pick one relic to keep</p>
        <div className="relic-choices">
          {choices.map((relic, i) => (
            <RelicCard
              key={relic.relicId}
              relic={relic}
              onPick={() => onPick(relic)}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
