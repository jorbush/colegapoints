import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import PointEventCard from '../../src/components/PointEventCard.astro';

describe('PointEventCard component', () => {
  it('renders a positive point event correctly', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(PointEventCard, {
      props: {
        from: { name: 'Alice', avatarEmoji: '😎' },
        to: { name: 'Bob', avatarEmoji: '🤓' },
        delta: 5,
        createdAt: new Date('2026-05-16T10:00:00Z'),
        variant: 'full',
      },
    });

    expect(result).toContain('Alice');
    expect(result).toContain('Bob');
    expect(result).toContain('+5');
    expect(result).toContain('gave');
  });

  it('renders a negative point event in compact variant', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(PointEventCard, {
      props: {
        from: { name: 'Alice', avatarEmoji: '😎' },
        to: { name: 'Bob', avatarEmoji: '🤓' },
        delta: -3,
        createdAt: new Date('2026-05-16T10:00:00Z'),
        variant: 'compact',
      },
    });

    expect(result).toContain('Alice');
    expect(result).toContain('Bob');
    expect(result).toContain('-3');
    expect(result).toContain('took');
  });
});
