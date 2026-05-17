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
  let selectedTargetIds: string[] = [];
  const targetList = modal.querySelector('#target-member-list');
  const saved = storage.getMember(groupId);
  const savedId = saved?.id;

  members.forEach((m) => {
    if (m.id === savedId) return; // skip self
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.memberId = m.id;
    btn.innerHTML = `
      <span class="text-2xl">${m.avatarEmoji}</span>
      <span class="text-sm font-black uppercase">${m.name}</span>
      <span class="target-check absolute -top-1.5 -right-1.5 hidden flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--brand)] text-[10px] font-black text-white shadow-[1px_1px_0px_var(--border)] animate-pop-in">✓</span>
    `;
    btn.className = 'target-btn btn btn-ghost px-3 py-2 gap-2 relative';
    btn.addEventListener('click', () => {
      const idx = selectedTargetIds.indexOf(m.id);
      if (idx > -1) {
        selectedTargetIds.splice(idx, 1);
        btn.classList.remove('bg-[var(--accent)]', '-translate-y-1', 'translate-x-1');
        btn.querySelector('.target-check')?.classList.add('hidden');
      } else {
        selectedTargetIds.push(m.id);
        btn.classList.add('bg-[var(--accent)]', '-translate-y-1', 'translate-x-1');
        btn.querySelector('.target-check')?.classList.remove('hidden');
      }
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

    if (selectedTargetIds.length === 0) {
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
        toMemberIds: selectedTargetIds,
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
    getSelectedTargetId: () => (selectedTargetIds.length === 1 ? selectedTargetIds[0] : null),
    getSelectedTargetIds: () => selectedTargetIds,
  };
}
