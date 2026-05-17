import { describe, it, expect, vi } from 'vitest';
import { POST } from '../../../../src/pages/api/groups/[id]/points';
import { db } from '../../../../src/db';

vi.mock('../../../../src/db', () => ({
  db: {
    query: {
      groups: {
        findFirst: vi.fn(),
      },
      members: {
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

describe('POST /api/groups/[id]/points', () => {
  it('sends points successfully', async () => {
    (db.query.groups.findFirst as any).mockResolvedValueOnce({ id: 'g1', name: 'Squad' });
    (db.query.members.findFirst as any)
      .mockResolvedValueOnce({ id: 'm1', groupId: 'g1', name: 'Alice' }) // from
      .mockResolvedValueOnce({ id: 'm2', groupId: 'g1', name: 'Bob', avatarEmoji: '🤓' }); // to

    const request = new Request('http://localhost/api/groups/g1/points', {
      method: 'POST',
      body: JSON.stringify({
        fromMemberId: 'm1',
        toMemberId: 'm2',
        delta: 5,
        reason: 'Helping out',
      }),
    });

    const response = await POST({ params: { id: 'g1' }, request } as any);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.delta).toBe(5);
    expect(db.insert).toHaveBeenCalled();
  });

  it('returns 400 if giving points to self', async () => {
    (db.query.groups.findFirst as any).mockResolvedValueOnce({ id: 'g1', name: 'Squad' });

    const request = new Request('http://localhost/api/groups/g1/points', {
      method: 'POST',
      body: JSON.stringify({
        fromMemberId: 'm1',
        toMemberId: 'm1',
        delta: 5,
      }),
    });

    const response = await POST({ params: { id: 'g1' }, request } as any);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('You cannot give points to yourself');
  });

  it('sends points to multiple members successfully', async () => {
    (db.query.groups.findFirst as any).mockResolvedValueOnce({ id: 'g1', name: 'Squad' });
    (db.query.members.findFirst as any)
      .mockResolvedValueOnce({ id: 'm1', groupId: 'g1', name: 'Alice' }) // from
      .mockResolvedValueOnce({ id: 'm2', groupId: 'g1', name: 'Bob', avatarEmoji: '🤓' }) // target 1
      .mockResolvedValueOnce({ id: 'm3', groupId: 'g1', name: 'Charlie', avatarEmoji: '👾' }); // target 2

    const request = new Request('http://localhost/api/groups/g1/points', {
      method: 'POST',
      body: JSON.stringify({
        fromMemberId: 'm1',
        toMemberIds: ['m2', 'm3'],
        delta: 3,
        reason: 'Amazing job',
      }),
    });

    const response = await POST({ params: { id: 'g1' }, request } as any);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.delta).toBe(3);
    expect(data.ids).toBeDefined();
    expect(data.ids.length).toBe(2);

    expect(db.insert).toHaveBeenCalled();
    const { notifyGroup } = await import('../../../../src/lib/push');
    expect(notifyGroup).toHaveBeenCalledWith(
      'g1',
      {
        title: '🤓👾 Multiple members got +3 points!',
        body: 'Alice gave 3 points from Bob, Charlie — "Amazing job"',
      },
      undefined
    );
  });

  it('returns 400 if one of multiple target members is self', async () => {
    (db.query.groups.findFirst as any).mockResolvedValueOnce({ id: 'g1', name: 'Squad' });

    const request = new Request('http://localhost/api/groups/g1/points', {
      method: 'POST',
      body: JSON.stringify({
        fromMemberId: 'm1',
        toMemberIds: ['m2', 'm1'],
        delta: 3,
      }),
    });

    const response = await POST({ params: { id: 'g1' }, request } as any);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('You cannot give points to yourself');
  });
});
