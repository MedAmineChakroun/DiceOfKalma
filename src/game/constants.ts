export const BASE_THRESHOLD = 300;
export const THRESHOLD_STEP = 25;
export const CAMPAIGN_LEVELS = 20;
export const HANDS_PER_LEVEL = 3;
export const REROLLS_PER_HAND = 3;
export const DICE_COUNT = 5;

export type ComboType =
  | 'high-die'
  | 'pair'
  | 'two-pairs'
  | 'three'
  | 'full-house'
  | 'straight'
  | 'four'
  | 'five';

export const COMBO_MULTS: Record<ComboType, number> = {
  'high-die': 5,
  pair: 10,
  'two-pairs': 20,
  three: 25,
  'full-house': 30,
  straight: 35,
  four: 40,
  five: 50,
};

export const COMBO_LABELS: Record<ComboType, string> = {
  'high-die': 'High Die',
  pair: 'Pair',
  'two-pairs': 'Two Pairs',
  three: 'Three of a Kind',
  'full-house': 'Full House',
  straight: 'Straight',
  four: 'Four of a Kind',
  five: 'Yahtzee',
};

export function getThreshold(level: number): number {
  return BASE_THRESHOLD + THRESHOLD_STEP * level * (level - 1);
}
