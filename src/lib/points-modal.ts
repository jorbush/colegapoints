import { storage } from './storage';
import { sendPoints } from './api';

export function initPointsModal(modal: HTMLElement) {
  const groupId = modal.dataset.groupId!;
  const members = JSON.parse(modal.dataset.members!) as any[];

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  // ── Target selection ────────────────────────────────────────────────────────
  let selectedTargetId: string | null = null;
  const targetList = modal.querySelector('#target-member-list');
  const saved = storage.getMember(groupId);
  const savedId = saved?.id;

  members.forEach((m) => {
    if (m.id === savedId) return; // skip self
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.memberId = m.id;
    btn.innerHTML = `<span class="text-2xl">${m.avatarEmoji}</span> <span class="text-sm font-black uppercase">${m.name}</span>`;
    btn.className = 'target-btn btn btn-ghost px-3 py-2 gap-2';
    btn.addEventListener('click', () => {
      modal
        .querySelectorAll('.target-btn')
        .forEach((b) =>
          b.classList.remove('bg-[var(--accent)]', '-translate-y-1', 'translate-x-1')
        );
      btn.classList.add('bg-[var(--accent)]', '-translate-y-1', 'translate-x-1');
      selectedTargetId = m.id;
    });
    targetList?.appendChild(btn);
  });

  // Auto-select if there's only one target option
  const targetButtons = targetList?.querySelectorAll('.target-btn');
  if (targetButtons && targetButtons.length === 1) {
    (targetButtons[0] as HTMLButtonElement).click();
  }

  // ── Delta selection ──────────────────────────────────────────────────────────
  let selectedDelta: number | null = null;
  modal.querySelectorAll('.delta-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      modal
        .querySelectorAll('.delta-btn')
        .forEach((b) =>
          b.classList.remove('bg-[var(--brand)]', 'text-white', '-translate-y-1', 'translate-x-1')
        );
      btn.classList.add('bg-[var(--brand)]', 'text-white', '-translate-y-1', 'translate-x-1');
      selectedDelta = parseInt((btn as HTMLElement).dataset.delta!);
      const customInput = modal.querySelector('#custom-delta') as HTMLInputElement | null;
      if (customInput) {
        customInput.value = '';
      }
    });
  });

  // ── Submit ───────────────────────────────────────────────────────────────────
  modal.querySelector('#submit-points-btn')?.addEventListener('click', async () => {
    const customVal = (modal.querySelector('#custom-delta') as HTMLInputElement | null)?.value;
    const delta = customVal ? parseInt(customVal) : selectedDelta;
    const reason = (modal.querySelector('#point-reason') as HTMLInputElement | null)?.value;
    const errorEl = modal.querySelector('#points-error') as HTMLElement;

    if (!selectedTargetId) {
      errorEl.textContent = 'Select a member!';
      errorEl.classList.remove('hidden');
      return;
    }
    if (!delta || delta === 0) {
      errorEl.textContent = 'Pick or enter points!';
      errorEl.classList.remove('hidden');
      return;
    }

    const btn = modal.querySelector('#submit-points-btn') as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      await sendPoints(groupId, {
        fromMemberId: savedId,
        toMemberId: selectedTargetId,
        delta,
        reason,
      });
      closeModal();
      window.location.reload();
    } catch (err: any) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
      btn.disabled = false;
      btn.textContent = 'Send Points ⭐';
    }
  });

  // Return the selected target ID state (useful for unit testing validation)
  return {
    getSelectedTargetId: () => selectedTargetId,
  };
}
