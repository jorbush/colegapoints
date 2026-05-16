import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import RecentActivity from '../../src/components/RecentActivity.astro';

describe('RecentActivity component', () => {
  const events = [
    { fromMemberId: '1', toMemberId: '2', delta: 5, createdAt: new Date() },
  ];
  const memberMap = {
    '1': { id: '1', name: 'Alice', avatarEmoji: '😎' },
    '2': { id: '2', name: 'Bob', avatarEmoji: '🤓' },
  };

  it('renders recent activity section', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(RecentActivity, {
      props: {
        events,
        memberMap,
        groupId: 'g1',
        totalEventsCount: 1
      },
    });

    expect(result).toContain('Recent Activity');
    expect(result).toContain('Alice');
    expect(result).toContain('Bob');
  });

  it('shows "See full history" link when there are many events', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(RecentActivity, {
      props: {
        events,
        memberMap,
        groupId: 'g1',
        totalEventsCount: 10
      },
    });

    expect(result).toContain('See full history');
  });
});
