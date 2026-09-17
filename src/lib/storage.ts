const DAILY_KEY_PREFIX = "ftdle-classic-day-";
const STATS_KEY = "ftdle-classic-stats";

export interface DailyState {
  guessIds: number[];
  won: boolean;
  finished: boolean;
}

export interface Stats {
  streak: number;
  bestStreak: number;
  totalPlayed: number;
  totalWon: number;
  lastPlayedDate: string | null;
  /** Score (nombre d'essais) des 7 derniers jours joués, clé = date AAAA-MM-JJ. */
  history: Record<string, number>;
}

const DEFAULT_STATS: Stats = {
  streak: 0,
  bestStreak: 0,
  totalPlayed: 0,
  totalWon: 0,
  lastPlayedDate: null,
  history: {},
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadDailyState(dateKey: string): DailyState {
  if (!isBrowser()) return { guessIds: [], won: false, finished: false };
  try {
    const raw = window.localStorage.getItem(DAILY_KEY_PREFIX + dateKey);
    if (!raw) return { guessIds: [], won: false, finished: false };
    return JSON.parse(raw) as DailyState;
  } catch {
    return { guessIds: [], won: false, finished: false };
  }
}

export function saveDailyState(dateKey: string, state: DailyState): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(DAILY_KEY_PREFIX + dateKey, JSON.stringify(state));
}

export function loadStats(): Stats {
  if (!isBrowser()) return DEFAULT_STATS;
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...(JSON.parse(raw) as Stats) };
  } catch {
    return DEFAULT_STATS;
  }
}

function saveStats(stats: Stats): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function isYesterday(previousDateKey: string, todayDateKey: string): boolean {
  const previous = new Date(previousDateKey + "T00:00:00");
  const today = new Date(todayDateKey + "T00:00:00");
  const diffDays = Math.round((today.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

/** À appeler une seule fois quand la partie du jour se termine (gagnée ou abandonnée). */
export function recordResult(dateKey: string, won: boolean, guessCount: number): Stats {
  const stats = loadStats();

  const alreadyRecordedToday = stats.lastPlayedDate === dateKey;
  if (alreadyRecordedToday) return stats;

  const continuesStreak = won && stats.lastPlayedDate !== null && isYesterday(stats.lastPlayedDate, dateKey);
  const newStreak = won ? (continuesStreak ? stats.streak + 1 : 1) : 0;

  const updated: Stats = {
    streak: newStreak,
    bestStreak: Math.max(stats.bestStreak, newStreak),
    totalPlayed: stats.totalPlayed + 1,
    totalWon: stats.totalWon + (won ? 1 : 0),
    lastPlayedDate: dateKey,
    history: won ? { ...stats.history, [dateKey]: guessCount } : stats.history,
  };

  saveStats(updated);
  return updated;
}
