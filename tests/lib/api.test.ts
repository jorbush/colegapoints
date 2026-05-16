import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGroup, joinGroup, sendPoints } from '../../src/lib/api';

describe('api lib', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('createGroup should send POST and return JSON', async () => {
    const mockResponse = { id: 'new-id', name: 'New Group' };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await createGroup('New Group', null);
    expect(fetch).toHaveBeenCalledWith(
      '/api/groups',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'New Group', description: null }),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it('joinGroup should send POST and return JSON', async () => {
    const mockMember = { id: 'm1', name: 'Jordi', avatarEmoji: '😎' };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMember,
    });

    const result = await joinGroup('g1', 'Jordi', '😎');
    expect(fetch).toHaveBeenCalledWith(
      '/api/groups/g1/join',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Jordi', emoji: '😎' }),
      })
    );
    expect(result).toEqual(mockMember);
  });

  it('sendPoints should throw error if response is not ok', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Too many points' }),
    });

    await expect(
      sendPoints('g1', { fromMemberId: '1', toMemberId: '2', delta: 10 })
    ).rejects.toThrow('Too many points');
  });
});
