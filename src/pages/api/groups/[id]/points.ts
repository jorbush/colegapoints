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
    const { fromMemberId, toMemberId, delta, reason } = body;

    if (!fromMemberId || !toMemberId || typeof delta !== 'number' || delta === 0) {
      return new Response(JSON.stringify({ error: 'Invalid point event data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (fromMemberId === toMemberId) {
      return new Response(JSON.stringify({ error: 'You cannot give points to yourself' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const [fromMember, toMember] = await Promise.all([
      db.query.members.findFirst({ where: eq(members.id, fromMemberId) }),
      db.query.members.findFirst({ where: eq(members.id, toMemberId) }),
    ]);

    if (!fromMember || fromMember.groupId !== groupId) {
      return new Response(JSON.stringify({ error: 'From-member not in group' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!toMember || toMember.groupId !== groupId) {
      return new Response(JSON.stringify({ error: 'To-member not in group' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = nanoid(12);
    await db.insert(pointEvents).values({
      id,
      groupId,
      fromMemberId,
      toMemberId,
      delta,
      reason: reason?.trim() || null,
    });

    const sign = delta > 0 ? '+' : '';
    const action = delta > 0 ? 'gave' : 'took';
    const pts = Math.abs(delta);
    const ptsLabel = pts === 1 ? 'point' : 'points';
    const reasonText = reason ? ` — "${reason}"` : '';

    await notifyGroup(
      groupId,
      {
        title: `${toMember.avatarEmoji} ${toMember.name} got ${sign}${delta} ${ptsLabel}!`,
        body: `${fromMember.name} ${action} ${pts} ${ptsLabel} from ${toMember.name}${reasonText}`,
      },
      undefined
    );

    return new Response(JSON.stringify({ id, delta }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to add point event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
