/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from '../../src/lib/storage';

describe('storage lib', () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    const mockStorage: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        for (const key in mockStorage) delete mockStorage[key];
      },
    });
  });

  it('should return empty array for getGroups when empty', () => {
    expect(storage.getGroups()).toEqual([]);
  });

  it('should save and retrieve a group', () => {
    const member = { id: 'm1', name: 'Jordi', avatarEmoji: '😎' };
    storage.saveGroupToList('g1', 'Squad', 'Description', member);

    const groups = storage.getGroups();
    expect(groups).toHaveLength(1);
    expect(groups[0].groupId).toBe('g1');
    expect(groups[0].memberName).toBe('Jordi');
  });

  it('should remove a group from the list', () => {
    const member = { id: 'm1', name: 'Jordi', avatarEmoji: '😎' };
    storage.saveGroupToList('g1', 'Squad', 'Description', member);
    storage.removeGroupFromList('g1');
    expect(storage.getGroups()).toEqual([]);
  });

  it('should save and retrieve member info', () => {
    const member = { id: 'm1', name: 'Jordi', avatarEmoji: '😎' };
    storage.saveMember('g1', member);
    expect(storage.getMember('g1')).toEqual(member);
  });

  it('should remove member info', () => {
    const member = { id: 'm1', name: 'Jordi', avatarEmoji: '😎' };
    storage.saveMember('g1', member);
    storage.removeMember('g1');
    expect(storage.getMember('g1')).toBeNull();
  });
});
