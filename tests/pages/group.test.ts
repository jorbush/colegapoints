import { describe, it, expect, vi, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import GroupPage from '../../src/pages/group/[id].astro';
import { db } from '../../src/db';

vi.mock('../../src/db', () => ({
  db: {
    query: {
      groups: {
        findFirst: vi.fn(),
      },
      members: {
        findMany: vi.fn(),
      },
      pointEvents: {
        findMany: vi.fn(),
      },
    },
  },
}));

describe('Group Detail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default group mock
    (db.query.groups.findFirst as any).mockResolvedValue({
      id: 'g1',
      name: 'Super Squad',
      description: 'The best group ever',
    });
    // Default events mock
    (db.query.pointEvents.findMany as any).mockResolvedValue([]);
  });

  it('disables the Give/Take Points button when the group has only 1 member', async () => {
    // Mock 1 member
    (db.query.members.findMany as any).mockResolvedValue([
      { id: 'm1', name: 'Alice', avatarEmoji: '😎', joinedAt: new Date() },
    ]);

    const container = await AstroContainer.create();
    const result = await container.renderToString(GroupPage, {
      params: { id: 'g1' },
      request: new Request('http://localhost/group/g1'),
    });

    // Verify the page title/header is rendered
    expect(result).toContain('Super Squad');

    // Verify the give/take points button is disabled
    // Look for both "add-points-btn" and the "disabled" attribute on it
    expect(result).toContain('id="add-points-btn"');
    expect(result).toContain('disabled');
    expect(result).toContain('title="Add more members to give or take points"');
  });

  it('enables the Give/Take Points button when the group has multiple members', async () => {
    // Mock 2 members
    (db.query.members.findMany as any).mockResolvedValue([
      { id: 'm1', name: 'Alice', avatarEmoji: '😎', joinedAt: new Date() },
      { id: 'm2', name: 'Bob', avatarEmoji: '🤓', joinedAt: new Date() },
    ]);

    const container = await AstroContainer.create();
    const result = await container.renderToString(GroupPage, {
      params: { id: 'g1' },
      request: new Request('http://localhost/group/g1'),
    });

    // Verify the page title/header is rendered
    expect(result).toContain('Super Squad');

    // Verify the give/take points button is not disabled
    expect(result).toContain('id="add-points-btn"');
    expect(result).not.toContain(
      'id="add-points-btn"\n        class="btn btn-primary w-full py-6 text-3xl uppercase italic shadow-lg"\n        disabled'
    );
    expect(result).not.toContain('title="Add more members to give or take points"');
  });
});
