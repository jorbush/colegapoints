import { describe, it, expect, vi } from 'vitest';
import { POST } from '../../../src/pages/api/sync/redeem';
import { db } from '../../../src/db';

vi.mock('../../../src/db', () => ({
  db: {
    query: {
      syncCodes: {
        findFirst: vi.fn(),
      },
      members: {
        findFirst: vi.fn(),
      },
      groups: {
        findFirst: vi.fn(),
      },
    },
    delete: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue({}),
  },
}));

describe('POST /api/sync/redeem', () => {
  it('redeems a valid code', async () => {
    // Mock code found and not expired
    (db.query.syncCodes.findFirst as any).mockResolvedValue({
      id: 'AB12XY',
      memberId: 'm1',
      groupId: 'g1',
      expiresAt: new Date(Date.now() + 10000),
    });
    // Mock member and group found
    (db.query.members.findFirst as any).mockResolvedValue({ id: 'm1', name: 'Jordi' });
    (db.query.groups.findFirst as any).mockResolvedValue({ id: 'g1', name: 'The Squad' });

    const request = new Request('http://localhost/api/sync/redeem', {
      method: 'POST',
      body: JSON.stringify({ code: 'AB12XY' }),
    });

    const response = await POST({ request } as any);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.member.name).toBe('Jordi');
    expect(db.delete).toHaveBeenCalled();
  });

  it('returns 404 for invalid/expired code', async () => {
    (db.query.syncCodes.findFirst as any).mockResolvedValue(null);

    const request = new Request('http://localhost/api/sync/redeem', {
      method: 'POST',
      body: JSON.stringify({ code: 'INVALID' }),
    });

    const response = await POST({ request } as any);
    expect(response.status).toBe(404);
  });
});
