import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { members } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const PATCH: APIRoute = async ({ params, request }) => {
  const memberId = params.id!;
  try {
    const body = await request.json();
    const { requestingMemberId, name, emoji } = body;

    if (!requestingMemberId) {
      return new Response(JSON.stringify({ error: 'requestingMemberId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (requestingMemberId !== memberId) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Cannot update another player' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!name || !emoji) {
      return new Response(JSON.stringify({ error: 'Name and emoji are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify the member actually exists
    const member = await db.query.members.findFirst({
      where: eq(members.id, memberId),
    });

    if (!member) {
      return new Response(JSON.stringify({ error: 'Member not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.update(members).set({ name, avatarEmoji: emoji }).where(eq(members.id, memberId));

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to update member' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
