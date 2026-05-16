import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { syncCodes, members, groups } from '../../../db/schema';
import { eq, and, gt } from 'drizzle-orm';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return new Response(JSON.stringify({ error: 'Code is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find valid code
    const syncCode = await db.query.syncCodes.findFirst({
      where: and(eq(syncCodes.id, code.toUpperCase()), gt(syncCodes.expiresAt, new Date())),
    });

    if (!syncCode) {
      return new Response(JSON.stringify({ error: 'Invalid or expired code' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get member and group details
    const member = await db.query.members.findFirst({
      where: eq(members.id, syncCode.memberId),
    });

    const group = await db.query.groups.findFirst({
      where: eq(groups.id, syncCode.groupId),
    });

    if (!member || !group) {
      return new Response(JSON.stringify({ error: 'Member or group no longer exists' }), {
        status: 410,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete the code (one-time use)
    await db.delete(syncCodes).where(eq(syncCodes.id, syncCode.id));

    return new Response(
      JSON.stringify({
        member,
        group,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to redeem sync code' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
