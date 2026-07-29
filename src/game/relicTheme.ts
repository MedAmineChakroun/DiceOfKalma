import { Relic } from './relics';

/** Flat Cuphead-style palette — one color per relic */
const RELIC_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22',
  '#1abc9c', '#f39c12', '#e91e63', '#00bcd4', '#8bc34a',
  '#ff5722', '#673ab7', '#009688', '#795548', '#607d8b',
  '#c0392b', '#2980b9', '#27ae60', '#8e44ad', '#d35400',
];

const DIE_ICONS = ['', '①', '②', '③', '④', '⑤', '⑥'];

const COMBO_ICONS: Record<string, string> = {
  'high-die': '⚡',
  pair: '✦',
  'two-pairs': '✦✦',
  three: '▲',
  'full-house': '⌂',
  straight: '↯',
  four: '◆',
  five: '★',
};

export interface RelicTheme {
  color: string;
  ink: string;
  icon: string;
  pattern: 'dots' | 'stripes' | 'stars' | 'plain';
}

function patternForType(type: string): RelicTheme['pattern'] {
  switch (type) {
    case 'contains':
    case 'count_gte':
      return 'dots';
    case 'sum_gt':
    case 'sum_lt':
      return 'stripes';
    case 'combo':
      return 'stars';
    default:
      return 'plain';
  }
}

function iconForRelic(relic: Relic): string {
  const { type, value } = relic.condition;
  if (type === 'contains' && typeof value === 'number') return DIE_ICONS[value] ?? '☠';
  if (type === 'count_gte' && typeof value === 'number') return DIE_ICONS[value] ?? '☠';
  if (type === 'combo' && typeof value === 'string') return COMBO_ICONS[value] ?? '☠';
  if (type === 'sum_gt') return '↑';
  if (type === 'sum_lt') return '↓';
  if (type === 'all_same') return '●';
  if (type === 'no_duplicates') return '◇';
  if (type === 'even_count_gte') return '◐';
  if (type === 'odd_count_gte') return '◑';
  return '☠';
}

export function getRelicTheme(relic: Relic): RelicTheme {
  const id = parseInt(relic.relicId, 10) || 0;
  const color = RELIC_COLORS[(id - 1) % RELIC_COLORS.length];
  return {
    color,
    ink: '#1a1208',
    icon: iconForRelic(relic),
    pattern: patternForType(relic.condition.type),
  };
}
