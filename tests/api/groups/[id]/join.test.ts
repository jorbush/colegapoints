import { describe, it, expect, vi } from 'vitest';
import { POST } from '../../../../src/pages/api/groups/[id]/join';
import { db } from '../../../../src/db';

vi.mock('../../../../src/db', () => ({
  db: {
    query: {
      groups: {
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('../../../../src/lib/push', () => ({
  notifyGroup: vi.fn(),
}));

describe('POST /api/groups/[id]/join', () => {
  it('joins a group successfully', async () => {
    (db.query.groups.findFirst as any).mockResolvedValueOnce({ id: 'g1', name: 'Squad' });
    
    const request = new Request('http://localhost/api/groups/g1/join', {
      method: 'POST',
      body: JSON.stringify({ name: 'Jordi', emoji: '😎' }),
    });

    const response = await POST({ params: { id: 'g1' }, request } as any);
    expect(response.status).toBe(201);
    
    const data = await response.json();
    expect(data.name).toBe('Jordi');
    expect(db.insert).toHaveBeenCalled();
  });

  it('returns 404 if group does not exist', async () => {
    (db.query.groups.findFirst as any).mockResolvedValueOnce(null);
    
    const request = new Request('http://localhost/api/groups/g1/join', {
      method: 'POST',
      body: JSON.stringify({ name: 'Jordi' }),
    });

    const response = await POST({ params: { id: 'g1' }, request } as any);
    expect(response.status).toBe(404);
  });
});
