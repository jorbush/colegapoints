import type { APIRoute } from 'astro';
import { db } from '../../../../db';
import { members } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export const POST: APIRoute = async ({ params, request }) => {
  const groupId = params.id!;
  try {
    const body = await request.json();
    const { memberId, subscription } = body;
    if (!memberId) {
      return new Response(JSON.stringify({ error: 'memberId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const member = await db.query.members.findFirst({ where: eq(members.id, memberId) });
    if (!member || member.groupId !== groupId) {
      return new Response(JSON.stringify({ error: 'Member not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db
      .update(members)
      .set({ pushSubscription: subscription ? JSON.stringify(subscription) : null })
      .where(eq(members.id, memberId));

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to save subscription' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
