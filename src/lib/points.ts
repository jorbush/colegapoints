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
export function calculatePointTotals(members: Member[], events: PointEvent[]): Record<string, number> {
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
