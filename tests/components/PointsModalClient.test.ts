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

  it('renders a checkmark badge inside each target button which is initially hidden', () => {
    // Current user is Alice (id: '1')
    localStorage.setItem(
      'cp_member_g1',
      JSON.stringify({ id: '1', name: 'Alice', avatarEmoji: '😎' })
    );

    const modalEl = createModalDOM('g1', members3);
    document.body.appendChild(modalEl);

    initPointsModal(modalEl);

    const targetBtns = modalEl.querySelectorAll('.target-btn');
    expect(targetBtns.length).toBe(2);

    targetBtns.forEach((btn) => {
      const badge = btn.querySelector('.target-check') as HTMLElement;
      expect(badge).not.toBeNull();
      expect(badge.textContent).toBe('✓');
      expect(badge.classList.contains('hidden')).toBe(true);
    });
  });

  it('allows multiple target members to be selected simultaneously and toggled', () => {
    // Current user is Alice (id: '1')
    localStorage.setItem(
      'cp_member_g1',
      JSON.stringify({ id: '1', name: 'Alice', avatarEmoji: '😎' })
    );

    const modalEl = createModalDOM('g1', members3);
    document.body.appendChild(modalEl);

    const state = initPointsModal(modalEl);

    const targetBtns = modalEl.querySelectorAll('.target-btn');
    const bobBtn = Array.from(targetBtns).find(
      (btn) => (btn as HTMLElement).dataset.memberId === '2'
    ) as HTMLElement;
    const charlieBtn = Array.from(targetBtns).find(
      (btn) => (btn as HTMLElement).dataset.memberId === '3'
    ) as HTMLElement;

    expect(bobBtn).not.toBeUndefined();
    expect(charlieBtn).not.toBeUndefined();

    // Select Bob
    bobBtn.click();

    const bobBadge = bobBtn.querySelector('.target-check') as HTMLElement;
    const charlieBadge = charlieBtn.querySelector('.target-check') as HTMLElement;

    expect(bobBadge.classList.contains('hidden')).toBe(false);
    expect(charlieBadge.classList.contains('hidden')).toBe(true);
    expect(state.getSelectedTargetId()).toBe('2');
    expect(state.getSelectedTargetIds()).toEqual(['2']);

    // Select Charlie as well
    charlieBtn.click();

    expect(bobBadge.classList.contains('hidden')).toBe(false);
    expect(charlieBadge.classList.contains('hidden')).toBe(false);
    expect(state.getSelectedTargetId()).toBeNull(); // Multiple are selected, so single target helper returns null
    expect(state.getSelectedTargetIds()).toEqual(['2', '3']);

    // Deselect Bob
    bobBtn.click();

    expect(bobBadge.classList.contains('hidden')).toBe(true);
    expect(charlieBadge.classList.contains('hidden')).toBe(false);
    expect(state.getSelectedTargetId()).toBe('3');
    expect(state.getSelectedTargetIds()).toEqual(['3']);
  });

  it('submits points for multiple selected target members', async () => {
    // Current user is Alice (id: '1')
    localStorage.setItem(
      'cp_member_g1',
      JSON.stringify({ id: '1', name: 'Alice', avatarEmoji: '😎' })
    );

    const modalEl = createModalDOM('g1', members3);
    document.body.appendChild(modalEl);

    initPointsModal(modalEl);

    const targetBtns = modalEl.querySelectorAll('.target-btn');
    const bobBtn = Array.from(targetBtns).find(
      (btn) => (btn as HTMLElement).dataset.memberId === '2'
    ) as HTMLElement;
    const charlieBtn = Array.from(targetBtns).find(
      (btn) => (btn as HTMLElement).dataset.memberId === '3'
    ) as HTMLElement;

    // Select both Bob and Charlie
    bobBtn!.click();
    charlieBtn!.click();

    // Choose +5 delta
    const deltaBtn = modalEl.querySelector('.delta-btn[data-delta="5"]') as HTMLElement;
    deltaBtn.click();

    // Enter reason
    const reasonInput = modalEl.querySelector('#point-reason') as HTMLInputElement;
    reasonInput.value = 'Awesome work';

    // Submit
    const submitBtn = modalEl.querySelector('#submit-points-btn') as HTMLElement;
    submitBtn.click();

    const { sendPoints } = await import('../../src/lib/api');
    expect(sendPoints).toHaveBeenCalledWith('g1', {
      fromMemberId: '1',
      toMemberIds: ['2', '3'],
      delta: 5,
      reason: 'Awesome work',
    });
  });
});
