import { ComboType } from './constants';

export function rollDice(count = 5): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
}

export function rerollDice(dice: number[], indices: number[]): number[] {
  const next = [...dice];
  for (const i of indices) {
    if (i >= 0 && i < next.length) {
      next[i] = Math.floor(Math.random() * 6) + 1;
    }
  }
  return next;
}

export function findCombo(dices: number[]): ComboType {
  const counts = new Map<number, number>();
  for (const d of dices) {
    counts.set(d, (counts.get(d) ?? 0) + 1);
  }
  const values = [...counts.values()];

  if (values.includes(5)) return 'five';
  if (values.includes(4)) return 'four';
  if (values.includes(3) && values.includes(2)) return 'full-house';
  if (values.includes(3)) return 'three';
  if (values.filter((v) => v === 2).length === 2) return 'two-pairs';
  if (values.includes(2)) return 'pair';
  if (dices.includes(1) && dices.includes(6)) return 'high-die';
  return 'straight';
}

export function findComboMult(dices: number[]): number {
  const combo = findCombo(dices);
  const mults: Record<ComboType, number> = {
    'high-die': 5,
    pair: 10,
    'two-pairs': 20,
    three: 25,
    'full-house': 30,
    straight: 35,
    four: 40,
    five: 50,
  };
  return mults[combo];
}

export function findComboSum(dices: number[]): number {
  return dices.reduce((a, b) => a + b, 0);
}
