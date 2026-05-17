import { describe, it, expect } from 'vitest';
import {
  calculatePointTotals,
  sortMembersByPoints,
  formatPoints,
  type Member,
  type PointEvent,
} from '../../src/lib/points';

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

  describe('formatPoints', () => {
    it('leaves points < 1000 as is', () => {
      expect(formatPoints(0)).toBe('0');
      expect(formatPoints(5)).toBe('5');
      expect(formatPoints(999)).toBe('999');
      expect(formatPoints(-5)).toBe('-5');
      expect(formatPoints(-999)).toBe('-999');
    });

    it('formats thousands correctly as K', () => {
      expect(formatPoints(1000)).toBe('1K');
      expect(formatPoints(1050)).toBe('1.1K');
      expect(formatPoints(1500)).toBe('1.5K');
      expect(formatPoints(999900)).toBe('999.9K');
      expect(formatPoints(-1000)).toBe('-1K');
      expect(formatPoints(-1500)).toBe('-1.5K');
    });

    it('formats millions correctly as M', () => {
      expect(formatPoints(1000000)).toBe('1M');
      expect(formatPoints(1500000)).toBe('1.5M');
      expect(formatPoints(999900000)).toBe('999.9M');
      expect(formatPoints(-1000000)).toBe('-1M');
      expect(formatPoints(-1500000)).toBe('-1.5M');
    });

    it('formats billions correctly as B', () => {
      expect(formatPoints(1000000000)).toBe('1B');
      expect(formatPoints(1500000000)).toBe('1.5B');
      expect(formatPoints(100000000000)).toBe('100B');
      expect(formatPoints(-1000000000)).toBe('-1B');
    });

    it('correctly handles boundary rounding without producing 1000K or 1000M', () => {
      // 999,950 should round to 1M
      expect(formatPoints(999950)).toBe('1M');
      expect(formatPoints(999949)).toBe('999.9K');

      // 999,950,000 should round to 1B
      expect(formatPoints(999950000)).toBe('1B');
      expect(formatPoints(999949000)).toBe('999.9M');
    });
  });
});
