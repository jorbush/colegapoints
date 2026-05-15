import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { groups } from '../../../db/schema';
import { nanoid } from 'nanoid';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const name = (body.name ?? '').trim();
    if (!name) {
      return new Response(JSON.stringify({ error: 'Group name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = nanoid(8);
    await db.insert(groups).values({
      id,
      name,
      description: body.description ?? null,
    });

    return new Response(JSON.stringify({ id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to create group' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
