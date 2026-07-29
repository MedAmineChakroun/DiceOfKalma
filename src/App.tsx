import { useState, useCallback } from 'react';
import {
  CAMPAIGN_LEVELS,
  getThreshold,
  HANDS_PER_LEVEL,
  REROLLS_PER_HAND,
  COMBO_LABELS,
} from './game/constants';
import { rollDice, rerollDice } from './game/combos';
import { findComboScore, pickRelicChoices, Relic, ScoreBreakdown } from './game/relics';
import { addToLeaderboard } from './game/leaderboard';
import MainMenu from './components/MainMenu';
import Logo from './components/Logo';
import HUD from './components/HUD';
import DiceTray from './components/DiceTray';
import ScoreReveal from './components/ScoreReveal';
import RelicPicker from './components/RelicPicker';
import RelicTray from './components/RelicTray';
import ConfirmDialog from './components/ConfirmDialog';
import './App.css';

type Screen = 'menu' | 'game' | 'gameover' | 'victory';

interface GameState {
  level: number;
  handsLeft: number;
  rerollsLeft: number;
  levelScore: number;
  totalScore: number;
  dice: number[];
  ownedRelics: Relic[];
  selectedIndices: Set<number>;
  phase: 'rolling' | 'scoring' | 'relic-pick' | 'level-win';
  lastScore?: ScoreBreakdown;
  relicChoices: Relic[];
}

const REROLL_ANIM_MS = 550;

function freshHand(state: GameState): GameState {
  return {
    ...state,
    dice: rollDice(),
    rerollsLeft: REROLLS_PER_HAND,
    selectedIndices: new Set(),
    phase: 'rolling',
    lastScore: undefined,
  };
}

function freshLevel(level: number, totalScore: number, ownedRelics: Relic[]): GameState {
  return freshHand({
    level,
    handsLeft: HANDS_PER_LEVEL,
    rerollsLeft: REROLLS_PER_HAND,
    levelScore: 0,
    totalScore,
    dice: rollDice(),
    ownedRelics,
    selectedIndices: new Set(),
    phase: 'rolling',
    relicChoices: [],
  });
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [game, setGame] = useState<GameState>(() => freshLevel(1, 0, []));
  const [rollingIndices, setRollingIndices] = useState<Set<number>>(new Set());
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [savedScore, setSavedScore] = useState(false);

  const abandonRun = () => {
    setGame(freshLevel(1, 0, []));
    setRollingIndices(new Set());
    setShowAbandonConfirm(false);
    setScreen('menu');
  };

  const startGame = () => {
    setGame(freshLevel(1, 0, []));
    setRollingIndices(new Set());
    setSavedScore(false);
    setPlayerName('');
    setScreen('game');
  };

  const toggleDie = (index: number) => {
    if (game.phase !== 'rolling' || rollingIndices.size > 0) return;
    setGame((g) => {
      const next = new Set(g.selectedIndices);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return { ...g, selectedIndices: next };
    });
  };

  const handleReroll = () => {
    if (game.phase !== 'rolling' || game.rerollsLeft <= 0 || rollingIndices.size > 0) return;
    const indices = [...game.selectedIndices];
    if (indices.length === 0) return;

    setRollingIndices(new Set(indices));

    setTimeout(() => {
      setGame((g) => ({
        ...g,
        dice: rerollDice(g.dice, indices),
        rerollsLeft: g.rerollsLeft - 1,
        selectedIndices: new Set(),
      }));
      setRollingIndices(new Set());
    }, REROLL_ANIM_MS);
  };

  const handlePlay = () => {
    if (game.phase !== 'rolling' || rollingIndices.size > 0) return;
    const breakdown = findComboScore(game.dice, game.ownedRelics);
    const newLevelScore = game.levelScore + breakdown.score;
    setGame((g) => ({
      ...g,
      phase: 'scoring',
      lastScore: breakdown,
      levelScore: newLevelScore,
      totalScore: g.totalScore + breakdown.score,
      selectedIndices: new Set(),
    }));
  };

  const advanceAfterScore = useCallback(() => {
    setGame((g) => {
      const threshold = getThreshold(g.level);
      if (g.levelScore >= threshold) {
        if (g.level >= CAMPAIGN_LEVELS) {
          setScreen('victory');
          return g;
        }
        const choices = pickRelicChoices(g.ownedRelics);
        if (choices.length === 0) {
          return freshLevel(g.level + 1, g.totalScore, g.ownedRelics);
        }
        return { ...g, phase: 'relic-pick', relicChoices: choices };
      }
      const handsLeft = g.handsLeft - 1;
      if (handsLeft <= 0) {
        setScreen('gameover');
        return g;
      }
      return freshHand({ ...g, handsLeft });
    });
  }, []);

  const pickRelic = (relic: Relic) => {
    setGame((g) => {
      const owned = [...g.ownedRelics, relic];
      return freshLevel(g.level + 1, g.totalScore, owned);
    });
  };

  const saveScore = () => {
    addToLeaderboard(playerName, game.level, game.totalScore);
    setSavedScore(true);
  };

  const threshold = getThreshold(game.level);

  if (screen === 'menu') {
    return <MainMenu onPlay={startGame} />;
  }

  if (screen === 'gameover') {
    return (
      <div className="end-screen bounce-in">
        <div className="cartoon-panel end-panel">
          <h1 className="cartoon-title end-title">Game Over!</h1>
          <p className="end-stat">Reached Level {game.level}</p>
          <p className="end-stat">Total Score: {game.totalScore.toLocaleString()}</p>

          {!savedScore ? (
            <div className="end-save">
              <input
                type="text"
                className="cartoon-input"
                placeholder="Your name"
                value={playerName}
                maxLength={20}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <button type="button" className="primary" onClick={saveScore}>
                Save to Leaderboard
              </button>
              <button type="button" onClick={() => setScreen('menu')}>
                Skip
              </button>
            </div>
          ) : (
            <p className="end-saved">Saved!</p>
          )}

          {savedScore && (
            <button type="button" className="primary" onClick={() => setScreen('menu')}>
              Back to Menu
            </button>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'victory') {
    return (
      <div className="end-screen bounce-in">
        <div className="cartoon-panel end-panel victory">
          <h1 className="cartoon-title end-title">You Win!</h1>
          <p className="end-stat">All {CAMPAIGN_LEVELS} levels cleared!</p>
          <p className="end-stat">Total Score: {game.totalScore.toLocaleString()}</p>

          {!savedScore ? (
            <div className="end-save">
              <input
                type="text"
                className="cartoon-input"
                placeholder="Your name"
                value={playerName}
                maxLength={20}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <button type="button" className="primary" onClick={saveScore}>
                Save to Leaderboard
              </button>
              <button type="button" onClick={() => setScreen('menu')}>
                Skip
              </button>
            </div>
          ) : (
            <p className="end-saved">Saved!</p>
          )}

          {savedScore && (
            <button type="button" className="primary" onClick={() => setScreen('menu')}>
              Back to Menu
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="game-layout">
      <header className="game-header">
        <button
          type="button"
          className="menu-btn"
          onClick={() => setShowAbandonConfirm(true)}
          aria-label="Back to menu"
        >
          ☰ Menu
        </button>
        <Logo size="sm" className="game-logo-wrap" />
        <div className="header-spacer" aria-hidden />
      </header>

      <HUD
        level={game.level}
        handsLeft={game.handsLeft}
        rerollsLeft={game.rerollsLeft}
        levelScore={game.levelScore}
        threshold={threshold}
      />

      <main className="game-main cartoon-panel">
        {game.phase === 'scoring' && game.lastScore ? (
          <ScoreReveal
            breakdown={game.lastScore}
            comboLabel={COMBO_LABELS[game.lastScore.combo]}
            onContinue={advanceAfterScore}
          />
        ) : (
          <>
            <p className="combo-hint cartoon-subtitle">
              {game.phase === 'rolling' && rollingIndices.size === 0
                ? 'Tap dice to select · Reroll or Play'
                : rollingIndices.size > 0
                  ? 'Rolling...'
                  : ''}
            </p>
            <DiceTray
              dice={game.dice}
              selected={game.selectedIndices}
              rolling={rollingIndices}
              onToggle={toggleDie}
              disabled={game.phase !== 'rolling'}
            />
            <div className="action-row">
              <button
                type="button"
                onClick={handleReroll}
                disabled={
                  game.phase !== 'rolling' ||
                  game.rerollsLeft <= 0 ||
                  game.selectedIndices.size === 0 ||
                  rollingIndices.size > 0
                }
              >
                Reroll ({game.rerollsLeft})
              </button>
              <button
                type="button"
                className="primary"
                onClick={handlePlay}
                disabled={game.phase !== 'rolling' || rollingIndices.size > 0}
              >
                Play Hand
              </button>
            </div>
          </>
        )}
      </main>

      <RelicTray relics={game.ownedRelics} activated={game.lastScore?.activatedRelics ?? []} />

      {game.phase === 'relic-pick' && (
        <RelicPicker choices={game.relicChoices} onPick={pickRelic} />
      )}

      {showAbandonConfirm && (
        <ConfirmDialog
          title="Abandon Run?"
          message="Your current progress will be lost. Return to the main menu?"
          confirmLabel="Abandon"
          cancelLabel="Keep Playing"
          onConfirm={abandonRun}
          onCancel={() => setShowAbandonConfirm(false)}
        />
      )}
    </div>
  );
}
