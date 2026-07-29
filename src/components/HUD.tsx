import './HUD.css';

interface Props {
  level: number;
  handsLeft: number;
  rerollsLeft: number;
  levelScore: number;
  threshold: number;
}

export default function HUD({ level, handsLeft, rerollsLeft, levelScore, threshold }: Props) {
  const pct = Math.min(100, (levelScore / threshold) * 100);

  return (
    <div className="hud cartoon-panel">
      <div className="hud-stats">
        <div className="hud-stat">
          <span className="hud-label">Level</span>
          <span className="hud-value">{level}</span>
        </div>
        <div className="hud-stat">
          <span className="hud-label">Hands</span>
          <span className="hud-value">{handsLeft}</span>
        </div>
        <div className="hud-stat">
          <span className="hud-label">Rerolls</span>
          <span className="hud-value">{rerollsLeft}</span>
        </div>
      </div>

      <div className="hud-score">
        <div className="hud-score-row">
          <span className="hud-label">Score</span>
          <span className="hud-score-nums">
            <strong>{levelScore}</strong>
            <span className="hud-sep">/</span>
            <span>{threshold}</span>
          </span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
