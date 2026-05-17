export interface Member {
  id: string;
  name: string;
  avatarEmoji: string;
  joinedAt: number | Date;
}

export interface PointEvent {
  toMemberId: string;
  delta: number;
}

/**
 * Calculates point totals for each member based on point events.
 */
export function calculatePointTotals(
  members: Member[],
  events: PointEvent[]
): Record<string, number> {
  const totals: Record<string, number> = {};

  for (const member of members) {
    totals[member.id] = 0;
  }

  for (const event of events) {
    if (event.toMemberId in totals) {
      totals[event.toMemberId] += event.delta;
    }
  }

  return totals;
}

/**
 * Sorts members by their point totals in descending order.
 */
export function sortMembersByPoints(members: Member[], totals: Record<string, number>): Member[] {
  return [...members].sort((a, b) => (totals[b.id] ?? 0) - (totals[a.id] ?? 0));
}

/**
 * Formats a point total/delta to be concise, abbreviating large numbers (e.g. 1K, 1.5M, 2B).
 */
export function formatPoints(points: number): string {
  const abs = Math.abs(points);
  const sign = points < 0 ? '-' : '';

  if (abs < 1000) {
    return `${sign}${abs}`;
  }

  // Define thresholds based on the rounded value to prevent "1000K", "1000M", etc.
  if (abs < 999950) {
    const formatted = parseFloat((abs / 1000).toFixed(1));
    return `${sign}${formatted}K`;
  }
  if (abs < 999950000) {
    const formatted = parseFloat((abs / 1000000).toFixed(1));
    return `${sign}${formatted}M`;
  }
  const formatted = parseFloat((abs / 1000000000).toFixed(1));
  return `${sign}${formatted}B`;
}
