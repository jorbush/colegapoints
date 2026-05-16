import { describe, it, expect, vi } from 'vitest';
import { POST } from '../../../../src/pages/api/groups/[id]/subscribe';
import { db } from '../../../../src/db';

vi.mock('../../../../src/db', () => ({
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

describe('POST /api/groups/[id]/subscribe', () => {
  it('saves a push subscription for a member', async () => {
    (db.query.members.findFirst as any).mockResolvedValueOnce({ id: 'm1', groupId: 'g1' });

    const request = new Request('http://localhost/api/groups/g1/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        memberId: 'm1',
        subscription: { endpoint: 'https://example.com' },
      }),
    });

    const response = await POST({ params: { id: 'g1' }, request } as any);
    expect(response.status).toBe(200);
    expect(db.update).toHaveBeenCalled();
    expect((db as any).set).toHaveBeenCalledWith({
      pushSubscription: JSON.stringify({ endpoint: 'https://example.com' }),
    });
  });

  it('returns 400 if data is missing', async () => {
    const request = new Request('http://localhost/api/groups/g1/subscribe', {
      method: 'POST',
      body: JSON.stringify({ memberId: 'm1' }),
    });

    const response = await POST({ params: { id: 'g1' }, request } as any);
    expect(response.status).toBe(400);
  });
});
