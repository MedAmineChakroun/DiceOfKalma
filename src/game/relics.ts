import relicsData from './relics-data.json';
import { findCombo, findComboMult, findComboSum } from './combos';
import { ComboType } from './constants';

export interface RelicCondition {
  type: string;
  value?: number | string;
  count?: number;
}

export interface RelicEffect {
  bones?: number;
  mult?: number;
}

export interface Relic {
  relicId: string;
  name: string;
  describtion: string;
  condition: RelicCondition;
  effect: RelicEffect;
}

export const relics: Relic[] = relicsData as Relic[];

type ConditionCheck = (dices: number[], combo: ComboType, cond: RelicCondition) => boolean;

const CONDITION_CHECKS: Record<string, ConditionCheck> = {
  contains: (dices, _combo, cond) => dices.includes(cond.value as number),
  sum_gt: (dices, _combo, cond) => findComboSum(dices) > (cond.value as number),
  sum_lt: (dices, _combo, cond) => findComboSum(dices) < (cond.value as number),
  combo: (_dices, combo, cond) => combo === cond.value,
  count_gte: (dices, _combo, cond) =>
    dices.filter((d) => d === cond.value).length >= (cond.count ?? 0),
  all_same: (dices) => new Set(dices).size === 1,
  no_duplicates: (dices) => new Set(dices).size === dices.length,
  even_count_gte: (dices, _combo, cond) =>
    dices.filter((d) => d % 2 === 0).length >= (cond.count ?? 0),
  odd_count_gte: (dices, _combo, cond) =>
    dices.filter((d) => d % 2 === 1).length >= (cond.count ?? 0),
};

export function evaluateCondition(
  cond: RelicCondition,
  dices: number[],
  combo: ComboType
): boolean {
  const check = CONDITION_CHECKS[cond.type];
  if (!check) throw new Error(`Unknown relic condition type: ${cond.type}`);
  return check(dices, combo, cond);
}

export interface RelicBonus {
  name: string;
  bones: number;
  mult: number;
}

export interface ScoreBreakdown {
  combo: ComboType;
  baseBones: number;
  baseMult: number;
  relicBonuses: RelicBonus[];
  totalBones: number;
  totalMult: number;
  score: number;
  activatedRelics: string[];
}

export function findComboScore(
  dices: number[],
  ownedRelics: Relic[],
  redDices: Record<number, number> = {}
): ScoreBreakdown {
  const combo = findCombo(dices);
  const baseBones = findComboSum(dices);
  const baseMult = findComboMult(dices);

  let bonusBones = 0;
  let bonusMult = 0;
  const relicBonuses: RelicBonus[] = [];
  const activatedRelics: string[] = [];

  for (const relic of ownedRelics) {
    if (evaluateCondition(relic.condition, dices, combo)) {
      const b = relic.effect.bones ?? 0;
      const m = relic.effect.mult ?? 0;
      bonusBones += b;
      bonusMult += m;
      relicBonuses.push({ name: relic.name, bones: b, mult: m });
      activatedRelics.push(relic.name);
    }
  }

  let redMult = 0;
  dices.forEach((dice, index) => {
    if (redDices[index] === dice) redMult += 2;
  });

  const totalBones = baseBones + bonusBones;
  const totalMult = baseMult + bonusMult + redMult;

  return {
    combo,
    baseBones,
    baseMult,
    relicBonuses,
    totalBones,
    totalMult,
    score: totalBones * totalMult,
    activatedRelics,
  };
}

export function pickRelicChoices(ownedRelics: Relic[], count = 4): Relic[] {
  const available = relics.filter(
    (r) => !ownedRelics.some((o) => o.relicId === r.relicId)
  );
  if (available.length === 0) return [];
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
