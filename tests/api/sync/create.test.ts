import { describe, it, expect, vi } from 'vitest';
import { POST } from '../../../src/pages/api/sync/create';
import { db } from '../../../src/db';

vi.mock('../../../src/db', () => ({
  db: {
    query: {
      members: {
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue({}),
  },
}));

describe('POST /api/sync/create', () => {
  it('creates a sync code for valid member', async () => {
    // Mock member found
    (db.query.members.findFirst as any).mockResolvedValue({ id: 'm1', groupId: 'g1' });

    const request = new Request('http://localhost/api/sync/create', {
      method: 'POST',
      body: JSON.stringify({ groupId: 'g1', memberId: 'm1' }),
    });

    const response = await POST({ request } as any);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.code).toHaveLength(6);
    expect(db.insert).toHaveBeenCalled();
  });

  it('returns 404 if member does not exist', async () => {
    (db.query.members.findFirst as any).mockResolvedValue(null);

    const request = new Request('http://localhost/api/sync/create', {
      method: 'POST',
      body: JSON.stringify({ groupId: 'g1', memberId: 'm1' }),
    });

    const response = await POST({ request } as any);
    expect(response.status).toBe(404);
  });
});
