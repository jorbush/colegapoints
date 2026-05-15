import webpush from 'web-push';
import { db } from '../db';
import { members } from '../db/schema';
import { eq } from 'drizzle-orm';

webpush.setVapidDetails(
  import.meta.env.VAPID_EMAIL ?? 'mailto:admin@colegapoints.app',
  import.meta.env.VAPID_PUBLIC_KEY ?? '',
  import.meta.env.VAPID_PRIVATE_KEY ?? ''
);

export async function notifyGroup(
  groupId: string,
  payload: { title: string; body: string; icon?: string },
  excludeMemberId?: string
) {
  if (!import.meta.env.VAPID_PUBLIC_KEY) return; // skip if not configured

  const groupMembers = await db.query.members.findMany({
    where: eq(members.groupId, groupId),
  });

  const notifications = groupMembers
    .filter((m) => m.id !== excludeMemberId && m.pushSubscription)
    .map(async (m) => {
      try {
        const sub = JSON.parse(m.pushSubscription!);
        await webpush.sendNotification(sub, JSON.stringify(payload));
      } catch (e) {
        console.error(`Push failed for member ${m.id}:`, e);
      }
    });

  await Promise.allSettled(notifications);
}
