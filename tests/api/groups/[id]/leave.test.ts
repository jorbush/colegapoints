import { describe, it, expect, vi } from 'vitest';
import { DELETE } from '../../../../src/pages/api/groups/[id]/leave';
import { db } from '../../../../src/db';

vi.mock('../../../../src/db', () => ({
  db: {
    query: {
      members: {
        findFirst: vi.fn(),
      },
    },
    delete: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue({}),
  },
}));

describe('DELETE /api/groups/[id]/leave', () => {
  it('allows a member to leave the group', async () => {
    (db.query.members.findFirst as any).mockResolvedValueOnce({ id: 'm1', groupId: 'g1' });
    
    const request = new Request('http://localhost/api/groups/g1/leave', {
      method: 'DELETE',
      body: JSON.stringify({ memberId: 'm1' }),
    });

    const response = await DELETE({ params: { id: 'g1' }, request } as any);
    expect(response.status).toBe(200);
    expect(db.delete).toHaveBeenCalled();
  });

  it('returns 404 if member is not in the group', async () => {
    (db.query.members.findFirst as any).mockResolvedValueOnce(null);
    
    const request = new Request('http://localhost/api/groups/g1/leave', {
      method: 'DELETE',
      body: JSON.stringify({ memberId: 'm1' }),
    });

    const response = await DELETE({ params: { id: 'g1' }, request } as any);
    expect(response.status).toBe(404);
  });
});
