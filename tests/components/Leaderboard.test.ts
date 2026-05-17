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

  it('renders abbreviated large point totals on the leaderboard', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Leaderboard, {
      props: {
        members: [
          { id: '1', name: 'Alice', avatarEmoji: '😎', joinedAt: new Date() },
          { id: '2', name: 'Bob', avatarEmoji: '🤓', joinedAt: new Date() },
        ],
        pointTotals: { '1': 1000, '2': -1500000 },
      },
    });

    expect(result).toContain('Alice');
    expect(result).toContain('+1K');
    expect(result).toContain('Bob');
    expect(result).toContain('-1.5M');
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

  it('renders responsive wrapper layout to prevent top colega badge from squeezing name', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Leaderboard, {
      props: { members, pointTotals },
    });

    // Check that we have the flex-wrap class on the member content wrapper
    expect(result).toContain('flex flex-wrap items-center');
    // Check that we have the responsive gap values and sizes
    expect(result).toContain('gap-3 sm:gap-5');
    // Check that the top colega tag is rendered
    expect(result).toContain('tag tag-brand');
    expect(result).toContain('Top Colega');
  });
});
