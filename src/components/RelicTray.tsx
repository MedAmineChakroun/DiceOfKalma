import { Relic } from '../game/relics';
import RelicCard from './RelicCard';
import './RelicTray.css';

interface Props {
  relics: Relic[];
  activated: string[];
}

export default function RelicTray({ relics, activated }: Props) {
  if (relics.length === 0) return null;

  return (
    <aside className="relic-tray cartoon-panel">
      <h3 className="cartoon-subtitle tray-title">Your Skulls</h3>
      <div className="tray-cards">
        {relics.map((relic) => (
          <RelicCard
            key={relic.relicId}
            relic={relic}
            active={activated.includes(relic.name)}
          />
        ))}
      </div>
    </aside>
  );
}
