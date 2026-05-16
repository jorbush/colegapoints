export interface SavedGroup {
  groupId: string;
  groupName: string;
  groupDescription: string;
  memberId: string;
  memberName: string;
  memberEmoji: string;
  joinedAt: number;
}

const GROUPS_KEY = 'cp_groups';
const MEMBER_KEY_PREFIX = 'cp_member_';

export const storage = {
  getGroups(): SavedGroup[] {
    try {
      return JSON.parse(localStorage.getItem(GROUPS_KEY) ?? '[]');
    } catch {
      return [];
    }
  },

  saveGroupToList(
    groupId: string,
    groupName: string,
    groupDescription: string,
    member: { id: string; name: string; avatarEmoji: string }
  ) {
    try {
      const existing = this.getGroups();
      const filtered = existing.filter((g) => g.groupId !== groupId);
      filtered.unshift({
        groupId,
        groupName,
        groupDescription,
        memberId: member.id,
        memberName: member.name,
        memberEmoji: member.avatarEmoji,
        joinedAt: Date.now(),
      });
      localStorage.setItem(GROUPS_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to save group to list', e);
    }
  },

  removeGroupFromList(groupId: string) {
    try {
      const groups = this.getGroups();
      localStorage.setItem(GROUPS_KEY, JSON.stringify(groups.filter((g) => g.groupId !== groupId)));
    } catch (e) {
      console.error('Failed to remove group from list', e);
    }
  },

  getMember(groupId: string) {
    try {
      return JSON.parse(localStorage.getItem(`${MEMBER_KEY_PREFIX}${groupId}`) ?? 'null');
    } catch {
      return null;
    }
  },

  saveMember(groupId: string, member: any) {
    localStorage.setItem(`${MEMBER_KEY_PREFIX}${groupId}`, JSON.stringify(member));
  },

  removeMember(groupId: string) {
    localStorage.removeItem(`${MEMBER_KEY_PREFIX}${groupId}`);
  },
};
