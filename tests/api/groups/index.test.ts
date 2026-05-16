import { describe, it, expect, vi } from 'vitest';
import { POST } from '../../../src/pages/api/groups/index';
import { db } from '../../../src/db';

vi.mock('../../../src/db', () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue({}),
  },
}));

describe('POST /api/groups', () => {
  it('creates a new group', async () => {
    const request = new Request('http://localhost/api/groups', {
      method: 'POST',
      body: JSON.stringify({ name: 'The Squad' }),
    });

    const response = await POST({ request } as any);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.id).toBeDefined();
    expect(db.insert).toHaveBeenCalled();
  });

  it('returns 400 if name is missing', async () => {
    const request = new Request('http://localhost/api/groups', {
      method: 'POST',
      body: JSON.stringify({ name: '' }),
    });

    const response = await POST({ request } as any);
    expect(response.status).toBe(400);
  });
});
