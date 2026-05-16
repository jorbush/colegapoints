import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { syncCodes, members } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';

const generateCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { groupId, memberId } = body;

    if (!groupId || !memberId) {
      return new Response(JSON.stringify({ error: 'Missing groupId or memberId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify member exists in group
    const member = await db.query.members.findFirst({
      where: and(eq(members.id, memberId), eq(members.groupId, groupId)),
    });

    if (!member) {
      return new Response(JSON.stringify({ error: 'Member not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate unique code
    const id = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.insert(syncCodes).values({
      id,
      memberId,
      groupId,
      expiresAt,
    });

    return new Response(JSON.stringify({ code: id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to create sync code' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
