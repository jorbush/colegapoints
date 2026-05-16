import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Leaderboard from '../../src/components/Leaderboard.astro';

describe('Leaderboard component', () => {
  const members = [
    { id: '1', name: 'Alice', avatarEmoji: '😎', joinedAt: new Date() },
    { id: '2', name: 'Bob', avatarEmoji: '🤓', joinedAt: new Date() },
  ];
  const pointTotals = { '1': 10, '2': 5 };

  it('renders the leaderboard title and members', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Leaderboard, {
      props: { members, pointTotals },
    });

    expect(result).toContain('Leaderboard');
    expect(result).toContain('Alice');
    expect(result).toMatch(/\+\s*10/);
    expect(result).toContain('Bob');
    expect(result).toMatch(/\+\s*5/);
  });

  it('renders correctly with no members', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Leaderboard, {
      props: { members: [], pointTotals: {} },
    });

    expect(result).toContain('Leaderboard');
    // Should not contain member names
    expect(result).not.toContain('Alice');
  });
});
