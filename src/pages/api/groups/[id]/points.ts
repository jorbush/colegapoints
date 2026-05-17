import type { APIRoute } from 'astro';
import { db } from '../../../../db';
import { groups, members, pointEvents } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { notifyGroup } from '../../../../lib/push';

export const POST: APIRoute = async ({ params, request }) => {
  const groupId = params.id!;
  try {
    const group = await db.query.groups.findFirst({ where: eq(groups.id, groupId) });
    if (!group) {
      return new Response(JSON.stringify({ error: 'Group not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { fromMemberId, toMemberId, toMemberIds, delta, reason } = body;

    const targetIds: string[] = Array.isArray(toMemberIds)
      ? toMemberIds
      : toMemberId
        ? [toMemberId]
        : [];

    if (!fromMemberId || targetIds.length === 0 || typeof delta !== 'number' || delta === 0) {
      return new Response(JSON.stringify({ error: 'Invalid point event data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (targetIds.includes(fromMemberId)) {
      return new Response(JSON.stringify({ error: 'You cannot give points to yourself' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fromMember = await db.query.members.findFirst({ where: eq(members.id, fromMemberId) });
    if (!fromMember || fromMember.groupId !== groupId) {
      return new Response(JSON.stringify({ error: 'From-member not in group' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const toMembers = await Promise.all(
      targetIds.map((tid) => db.query.members.findFirst({ where: eq(members.id, tid) }))
    );

    for (let i = 0; i < toMembers.length; i++) {
      const tm = toMembers[i];
      if (!tm || tm.groupId !== groupId) {
        return new Response(JSON.stringify({ error: 'To-member not in group' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const eventsToInsert = toMembers.map((tm) => ({
      id: nanoid(12),
      groupId,
      fromMemberId,
      toMemberId: tm!.id,
      delta,
      reason: reason?.trim() || null,
    }));

    await db.insert(pointEvents).values(eventsToInsert);

    const sign = delta > 0 ? '+' : '';
    const action = delta > 0 ? 'gave' : 'took';
    const pts = Math.abs(delta);
    const ptsLabel = pts === 1 ? 'point' : 'points';
    const reasonText = reason ? ` — "${reason}"` : '';

    if (toMembers.length === 1) {
      const toMember = toMembers[0]!;
      await notifyGroup(
        groupId,
        {
          title: `${toMember.avatarEmoji} ${toMember.name} got ${sign}${delta} ${ptsLabel}!`,
          body: `${fromMember.name} ${action} ${pts} ${ptsLabel} from ${toMember.name}${reasonText}`,
        },
        undefined
      );
    } else {
      const names = toMembers.map((m) => m!.name).join(', ');
      const emojis = toMembers.map((m) => m!.avatarEmoji).join('');
      await notifyGroup(
        groupId,
        {
          title: `${emojis} Multiple members got ${sign}${delta} ${ptsLabel}!`,
          body: `${fromMember.name} ${action} ${pts} ${ptsLabel} from ${names}${reasonText}`,
        },
        undefined
      );
    }

    return new Response(
      JSON.stringify({ id: eventsToInsert[0].id, ids: eventsToInsert.map((e) => e.id), delta }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to add point event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
