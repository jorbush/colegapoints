import type { APIRoute } from 'astro';
import { db } from '../../../../db';
import { groups, members } from '../../../../db/schema';
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
    const name = (body.name ?? '').trim();
    const emoji = body.emoji ?? '😊';
    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = nanoid(10);
    await db.insert(members).values({ id, groupId, name, avatarEmoji: emoji });

    // Notify other members
    await notifyGroup(
      groupId,
      { title: `${emoji} ${name} joined!`, body: `${name} just joined ${group.name}. Say hi! 👋` },
      id
    );

    return new Response(JSON.stringify({ id, name, avatarEmoji: emoji }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to join group' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
