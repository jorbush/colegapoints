# API Reference

All API routes return JSON and use standard HTTP status codes.

## Base URL

`/api`

---

## Groups

### `POST /api/groups`

Create a new point group.

**Body:**

```json
{
  "name": "Team Rocket",
  "description": "Blasting off at the speed of light"
}
```

**Response (201 Created):**

```json
{
  "id": "abc123xy"
}
```

### `POST /api/groups/[id]/join`

Join an existing group.

**Body:**

```json
{
  "name": "Ash",
  "avatarEmoji": "⚡️"
}
```

**Response (201 Created):**

```json
{
  "memberId": "mem_xyz123"
}
```

### `POST /api/groups/[id]/leave`

Leave a group.

**Body:**

```json
{
  "memberId": "mem_xyz123"
}
```

**Response (200 OK):**

```json
{
  "success": true
}
```

---

## Points

### `POST /api/groups/[id]/points`

Add a point event (give or take points).

**Body:**

```json
{
  "fromMemberId": "mem_source",
  "toMemberId": "mem_target",
  "delta": 5,
  "reason": "Great work on the documentation!"
}
```

**Response (201 Created):**

```json
{
  "id": "evt_abc123",
  "delta": 5
}
```

---

## Subscriptions

### `POST /api/groups/[id]/subscribe`

Subscribe to push notifications for a group.

**Body:**

```json
{
  "memberId": "mem_xyz123",
  "subscription": { ...pushSubscriptionObject... }
}
```

**Response (200 OK):**

```json
{
  "success": true
}
```
