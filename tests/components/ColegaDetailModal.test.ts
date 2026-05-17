import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ColegaDetailModal from '../../src/components/ColegaDetailModal.astro';

describe('ColegaDetailModal component', () => {
  const members = [
    { id: 'm1', name: 'Alice', avatarEmoji: '😎', joinedAt: '2026-05-16T12:00:00.000Z' },
    { id: 'm2', name: 'Bob', avatarEmoji: '🤓', joinedAt: '2026-05-17T12:00:00.000Z' },
  ];

  const events = [
    {
      id: 'e1',
      groupId: 'g1',
      fromMemberId: 'm1',
      toMemberId: 'm2',
      delta: 5,
      reason: 'Helped with test',
      createdAt: '2026-05-17T12:05:00.000Z',
    },
    {
      id: 'e2',
      groupId: 'g1',
      fromMemberId: 'm2',
      toMemberId: 'm1',
      delta: -3,
      reason: 'Lost ping pong game',
      createdAt: '2026-05-17T12:10:00.000Z',
    },
  ];

  it('renders colega detail modal container with data-attributes', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ColegaDetailModal, {
      props: {
        members,
        events,
      },
    });

    // Check modal root exists with correct ID and serializes member/event data
    expect(result).toContain('id="colega-detail-modal"');
    expect(result).toContain('data-members');
    expect(result).toContain('data-events');

    // Check members and events JSON is embedded correctly
    expect(result).toContain('Alice');
    expect(result).toContain('Bob');
    expect(result).toContain('Helped with test');
    expect(result).toContain('Lost ping pong game');
  });

  it('renders layout elements for profile, statistics, and history list', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ColegaDetailModal, {
      props: {
        members,
        events,
      },
    });

    // Check title and details structure
    expect(result).toContain('Colega Profile');
    expect(result).toContain('id="detail-avatar"');
    expect(result).toContain('id="detail-name"');
    expect(result).toContain('id="detail-joined"');

    // Check key metrics boxes
    expect(result).toContain('id="detail-points"');
    expect(result).toContain('id="detail-rank"');

    // Check advanced statistics structure
    expect(result).toContain('Statistics');
    expect(result).toContain('id="stat-points-received"');
    expect(result).toContain('id="stat-points-deducted"');
    expect(result).toContain('id="stat-points-given"');
    expect(result).toContain('id="stat-points-taken"');
    expect(result).toContain('id="stat-total-interactions"');

    // Check history/recent activity container
    expect(result).toContain('Recent Activity');
    expect(result).toContain('id="detail-history-list"');
  });
});
