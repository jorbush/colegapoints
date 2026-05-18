import { describe, it, expect, vi } from 'vitest';
import { PATCH } from '../../../src/pages/api/members/[id]';
import { db } from '../../../src/db';

vi.mock('../../../src/db', () => ({
  db: {
    query: {
      members: {
        findFirst: vi.fn(),
      },
    },
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue({}),
  },
}));

describe('PATCH /api/members/[id]', () => {
  it('updates a member successfully if the requester is the member itself', async () => {
    (db.query.members.findFirst as any).mockResolvedValueOnce({
      id: 'm1',
      name: 'Jordi',
      avatarEmoji: '😊',
    });

    const request = new Request('http://localhost/api/members/m1', {
      method: 'PATCH',
      body: JSON.stringify({ requestingMemberId: 'm1', name: 'Jordi New', emoji: '🍍' }),
    });

    const response = await PATCH({ params: { id: 'm1' }, request } as any);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(db.update).toHaveBeenCalled();
  });

  it('returns 403 if requester tries to update another member', async () => {
    const request = new Request('http://localhost/api/members/m1', {
      method: 'PATCH',
      body: JSON.stringify({ requestingMemberId: 'm2', name: 'Hack Name', emoji: '💀' }),
    });

    const response = await PATCH({ params: { id: 'm1' }, request } as any);
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toContain('Unauthorized');
  });

  it('returns 400 if name or emoji is missing', async () => {
    const request = new Request('http://localhost/api/members/m1', {
      method: 'PATCH',
      body: JSON.stringify({ requestingMemberId: 'm1', name: '' }),
    });

    const response = await PATCH({ params: { id: 'm1' }, request } as any);
    expect(response.status).toBe(400);
  });

  it('returns 404 if member does not exist', async () => {
    (db.query.members.findFirst as any).mockResolvedValueOnce(null);

    const request = new Request('http://localhost/api/members/m1', {
      method: 'PATCH',
      body: JSON.stringify({ requestingMemberId: 'm1', name: 'Jordi', emoji: '🍍' }),
    });

    const response = await PATCH({ params: { id: 'm1' }, request } as any);
    expect(response.status).toBe(404);
  });
});
