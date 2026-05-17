/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initPointsModal } from '../../src/lib/points-modal';

vi.mock('../../src/lib/api', () => ({
  sendPoints: vi.fn(),
}));

describe('PointsModal client logic (JSDOM)', () => {
  const members3 = [
    { id: '1', name: 'Alice', avatarEmoji: '😎' },
    { id: '2', name: 'Bob', avatarEmoji: '🤓' },
    { id: '3', name: 'Charlie', avatarEmoji: '👾' },
  ];

  const members2 = [
    { id: '1', name: 'Alice', avatarEmoji: '😎' },
    { id: '2', name: 'Bob', avatarEmoji: '🤓' },
  ];

  function createModalDOM(groupId: string, members: any[]) {
    const modal = document.createElement('div');
    modal.id = 'points-modal';
    modal.dataset.groupId = groupId;
    modal.dataset.members = JSON.stringify(members);

    modal.innerHTML = `
      <div id="target-member-list"></div>
      <button class="delta-btn" data-delta="-5">-5</button>
      <button class="delta-btn" data-delta="5">+5</button>
      <input id="custom-delta" type="number" />
      <input id="point-reason" type="text" />
      <button id="submit-points-btn">Submit</button>
      <p id="points-error" class="hidden"></p>
    `;
    return modal;
  }

  beforeEach(() => {
    vi.clearAllMocks();

    // Stub localStorage
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

    // Mock window.location.reload
    vi.stubGlobal('location', {
      reload: vi.fn(),
    });

    document.body.innerHTML = '';
  });

  it('does NOT auto-select any target player when there is a group of 3 persons (more than 1 option)', () => {
    // Current user is Alice (id: '1')
    localStorage.setItem(
      'cp_member_g1',
      JSON.stringify({ id: '1', name: 'Alice', avatarEmoji: '😎' })
    );

    const modalEl = createModalDOM('g1', members3);
    document.body.appendChild(modalEl);

    const state = initPointsModal(modalEl);

    // No target should be automatically selected
    expect(state.getSelectedTargetId()).toBeNull();

    // Verify Bob and Charlie buttons exist
    const targetBtns = modalEl.querySelectorAll('.target-btn');
    expect(targetBtns.length).toBe(2);

    // Verify no buttons are highlighted
    targetBtns.forEach((btn) => {
      expect(btn.classList.contains('bg-[var(--accent)]')).toBe(false);
    });
  });

  it('automatically selects the only other player when there is a group of 2 persons (exactly 1 target option)', () => {
    // Current user is Alice (id: '1')
    localStorage.setItem(
      'cp_member_g1',
      JSON.stringify({ id: '1', name: 'Alice', avatarEmoji: '😎' })
    );

    const modalEl = createModalDOM('g1', members2);
    document.body.appendChild(modalEl);

    const state = initPointsModal(modalEl);

    // The other member (Bob, id: '2') should be automatically selected
    expect(state.getSelectedTargetId()).toBe('2');

    // Bob's button should have highlight classes applied
    const targetBtn = modalEl.querySelector('.target-btn') as HTMLElement;
    expect(targetBtn).not.toBeNull();
    expect(targetBtn.dataset.memberId).toBe('2');
    expect(targetBtn.classList.contains('bg-[var(--accent)]')).toBe(true);
    expect(targetBtn.classList.contains('-translate-y-1')).toBe(true);
    expect(targetBtn.classList.contains('translate-x-1')).toBe(true);
  });
});
