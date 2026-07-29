import { useState, useEffect } from 'react';
import { ScoreBreakdown } from '../game/relics';
import './ScoreReveal.css';

interface Props {
  breakdown: ScoreBreakdown;
  comboLabel: string;
  onContinue: () => void;
}

type Step = 'combo' | 'bones' | 'mult' | 'relics' | 'total';

export default function ScoreReveal({ breakdown, comboLabel, onContinue }: Props) {
  const [step, setStep] = useState<Step>('combo');

  useEffect(() => {
    const order: Step[] = ['combo', 'bones', 'mult'];
    if (breakdown.relicBonuses.length > 0) order.push('relics');
    order.push('total');

    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i < order.length) {
        setStep(order[i]);
      } else {
        clearInterval(timer);
      }
    }, 500);
    return () => clearInterval(timer);
  }, [breakdown]);

  const stepIndex = ['combo', 'bones', 'mult', 'relics', 'total'].indexOf(step);

  return (
    <div className="score-reveal shake">
      <p className="score-combo cartoon-subtitle bounce-in">{comboLabel}</p>

      <div className="score-breakdown">
        {stepIndex >= 1 && (
          <div className="score-line pop-number">
            <span className="score-tag bones-tag">Bones</span>
            <span className="score-num">{breakdown.totalBones}</span>
            {breakdown.relicBonuses.some((r) => r.bones > 0) && (
              <span className="score-detail">
                ({breakdown.baseBones} base
                {breakdown.relicBonuses
                  .filter((r) => r.bones > 0)
                  .map((r) => ` +${r.bones} ${r.name}`)
                  .join('')}
                )
              </span>
            )}
          </div>
        )}

        {stepIndex >= 2 && (
          <div className="score-line pop-number">
            <span className="score-tag mult-tag">× Mult</span>
            <span className="score-num">{breakdown.totalMult}</span>
            {breakdown.relicBonuses.some((r) => r.mult > 0) && (
              <span className="score-detail">
                ({breakdown.baseMult} base
                {breakdown.relicBonuses
                  .filter((r) => r.mult > 0)
                  .map((r) => ` +${r.mult} ${r.name}`)
                  .join('')}
                )
              </span>
            )}
          </div>
        )}

        {stepIndex >= 3 && breakdown.relicBonuses.length > 0 && (
          <div className="relic-activations pop-number">
            <span className="score-tag skull-tag">☠ Skulls</span>
            {breakdown.activatedRelics.map((name) => (
              <span key={name} className="relic-pop">{name}</span>
            ))}
          </div>
        )}

        {stepIndex >= 4 && (
          <div className="score-total pop-number">
            <span className="score-tag total-tag">Score</span>
            <span className="score-final">{breakdown.score}</span>
          </div>
        )}
      </div>

      {step === 'total' && (
        <button className="primary bounce-in" onClick={onContinue}>
          Continue
        </button>
      )}
    </div>
  );
}
