export interface LeaderboardEntry {
  name: string;
  level: number;
  score: number;
  date: string;
}

const STORAGE_KEY = 'dice-of-kalma-leaderboard';

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LeaderboardEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addToLeaderboard(name: string, level: number, score: number): void {
  const trimmed = name.trim() || 'Anonymous';
  const entries = getLeaderboard();
  const existing = entries.find((e) => e.name === trimmed);

  if (existing) {
    existing.level = Math.max(existing.level, level);
    existing.score += score;
    existing.date = new Date().toISOString();
  } else {
    entries.push({
      name: trimmed,
      level,
      score,
      date: new Date().toISOString(),
    });
  }

  entries.sort((a, b) => b.level - a.level || b.score - a.score);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 20)));
}
