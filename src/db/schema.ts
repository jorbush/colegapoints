import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const groups = sqliteTable('groups', {
  id: text('id').primaryKey(), // short nanoid slug e.g. "abc123"
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const members = sqliteTable('members', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  avatarEmoji: text('avatar_emoji').notNull().default('😊'),
  pushSubscription: text('push_subscription'), // JSON string
  joinedAt: integer('joined_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const pointEvents = sqliteTable('point_events', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  fromMemberId: text('from_member_id')
    .notNull()
    .references(() => members.id),
  toMemberId: text('to_member_id')
    .notNull()
    .references(() => members.id),
  delta: integer('delta').notNull(), // positive or negative
  reason: text('reason'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Group = typeof groups.$inferSelect;
export type Member = typeof members.$inferSelect;
export type PointEvent = typeof pointEvents.$inferSelect;
