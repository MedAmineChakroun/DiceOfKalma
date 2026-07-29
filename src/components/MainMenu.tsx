import { useState } from 'react';
import Logo from './Logo';
import Leaderboard from './Leaderboard';
import './MainMenu.css';

type MenuView = 'main' | 'leaderboard' | 'instructions';

interface Props {
  onPlay: () => void;
}

export default function MainMenu({ onPlay }: Props) {
  const [view, setView] = useState<MenuView>('main');

  if (view === 'leaderboard') {
    return <Leaderboard onBack={() => setView('main')} />;
  }

  if (view === 'instructions') {
    return (
      <div className="main-menu">
        <div className="cartoon-panel menu-panel bounce-in">
          <h2 className="cartoon-subtitle inst-title">How to Play</h2>
          <ul className="inst-list">
            <li>3 hands per level — hit the score threshold to advance</li>
            <li>3 rerolls per hand — tap dice to select, then reroll</li>
            <li>Score = Bones (sum) × Mult (combo + relics)</li>
            <li>Level up → pick a skull relic from 4 choices</li>
            <li>Combos: pair, two-pairs, three, full-house, straight, four, five, high-die (1+6)</li>
          </ul>
          <button type="button" className="primary" onClick={() => setView('main')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-menu">
      <div className="cuphead-dots cuphead-dots--tl" aria-hidden />
      <div className="cuphead-dots cuphead-dots--br" aria-hidden />

      <div className="cartoon-panel menu-panel bounce-in">
        <Logo />

        <p className="menu-tagline">Roll · Reroll · Stack skulls · Survive</p>

        <div className="menu-art" aria-hidden>
          <div className="menu-dice-row">
            {[
              { v: 6, c: 'var(--red)' },
              { v: 1, c: 'var(--blue)' },
              { v: 4, c: 'var(--teal)' },
              { v: 2, c: 'var(--purple)' },
              { v: 5, c: 'var(--orange)' },
            ].map(({ v, c }, i) => (
              <div
                key={i}
                className="menu-die"
                style={{
                  transform: `rotate(${i % 2 === 0 ? -8 : 8}deg)`,
                  background: c,
                  color: 'var(--cream)',
                }}
              >
                {v}
              </div>
            ))}
          </div>
        </div>

        <div className="menu-buttons">
          <button type="button" className="primary menu-play" onClick={onPlay}>
            Play Game
          </button>
          <button type="button" className="menu-secondary" onClick={() => setView('leaderboard')}>
            Leaderboard
          </button>
          <button type="button" className="menu-secondary" onClick={() => setView('instructions')}>
            Instructions
          </button>
        </div>
      </div>
    </div>
  );
}
