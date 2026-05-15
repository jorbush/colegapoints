import type { APIRoute } from 'astro';
import { db } from '../../../../db';
import { members } from '../../../../db/schema';
import { and, eq } from 'drizzle-orm';

export const DELETE: APIRoute = async ({ params, request }) => {
  const groupId = params.id!;
  try {
    const body = await request.json();
    const { memberId } = body;

    if (!memberId) {
      return new Response(JSON.stringify({ error: 'memberId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify the member actually belongs to this group before deleting
    const member = await db.query.members.findFirst({
      where: and(eq(members.id, memberId), eq(members.groupId, groupId)),
    });

    if (!member) {
      return new Response(JSON.stringify({ error: 'Member not found in this group' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db
      .delete(members)
      .where(and(eq(members.id, memberId), eq(members.groupId, groupId)));

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to leave group' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
