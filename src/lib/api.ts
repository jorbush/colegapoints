export async function createGroup(name: string, description: string | null) {
  const res = await fetch('/api/groups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Unknown error');
  return json;
}

export async function joinGroup(groupId: string, name: string, emoji: string) {
  const res = await fetch(`/api/groups/${groupId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, emoji }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Failed to join group');
  return json;
}

export async function sendPoints(
  groupId: string,
  data: {
    fromMemberId: string;
    toMemberId?: string;
    toMemberIds?: string[];
    delta: number;
    reason?: string;
  }
) {
  const res = await fetch(`/api/groups/${groupId}/points`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Failed to send points');
  return json;
}

export async function leaveGroup(groupId: string, memberId: string) {
  const res = await fetch(`/api/groups/${groupId}/leave`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId }),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error ?? 'Failed to leave group');
  }
}

export async function subscribePush(groupId: string, memberId: string, subscription: any) {
  const res = await fetch(`/api/groups/${groupId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId, subscription }),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error ?? 'Failed to subscribe to push');
  }
}

export async function createSyncCode(groupId: string, memberId: string) {
  const res = await fetch('/api/sync/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ groupId, memberId }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Failed to create sync code');
  return json.code;
}

export async function redeemSyncCode(code: string) {
  const res = await fetch('/api/sync/redeem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Failed to redeem sync code');
  return json; // { member, group }
}

export async function updateMember(
  memberId: string,
  data: { requestingMemberId: string; name: string; emoji: string }
) {
  const res = await fetch(`/api/members/${memberId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Failed to update member');
  return json;
}
