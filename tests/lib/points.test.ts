import { describe, it, expect } from 'vitest';
import { calculatePointTotals, sortMembersByPoints, type Member, type PointEvent } from '../../src/lib/points';

describe('points logic', () => {
  const members: Member[] = [
    { id: '1', name: 'Alice', avatarEmoji: '😎', joinedAt: 1000 },
    { id: '2', name: 'Bob', avatarEmoji: '🤓', joinedAt: 1001 },
    { id: '3', name: 'Charlie', avatarEmoji: '🧐', joinedAt: 1002 },
  ];

  const events: PointEvent[] = [
    { toMemberId: '1', delta: 5 },
    { toMemberId: '2', delta: 10 },
    { toMemberId: '1', delta: -2 },
    { toMemberId: '3', delta: 0 },
    { toMemberId: 'unknown', delta: 100 }, // Should be ignored
  ];

  it('calculates point totals correctly', () => {
    const totals = calculatePointTotals(members, events);
    expect(totals['1']).toBe(3);
    expect(totals['2']).toBe(10);
    expect(totals['3']).toBe(0);
    expect(totals['unknown']).toBeUndefined();
  });

  it('sorts members by points descending', () => {
    const totals = calculatePointTotals(members, events);
    const sorted = sortMembersByPoints(members, totals);
    expect(sorted[0].name).toBe('Bob'); // 10 pts
    expect(sorted[1].name).toBe('Alice'); // 3 pts
    expect(sorted[2].name).toBe('Charlie'); // 0 pts
  });
});
