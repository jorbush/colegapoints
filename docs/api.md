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

---

## Syncing

### `POST /api/sync/create`

Generate a short-lived sync code for a member of a group. The code is active for 10 minutes.

**Body:**

```json
{
  "groupId": "abc123xy",
  "memberId": "mem_xyz123"
}
```

**Response (201 Created):**

```json
{
  "code": "AB12XY"
}
```

### `POST /api/sync/redeem`

Redeem a sync code to transfer membership data to a new browser session. Redeeming deletes the code so it is one-time use only.

**Body:**

```json
{
  "code": "AB12XY"
}
```

**Response (200 OK):**

```json
{
  "member": {
    "id": "mem_xyz123",
    "groupId": "abc123xy",
    "name": "Ash",
    "avatarEmoji": "⚡️",
    "pushSubscription": null,
    "joinedAt": "2026-05-17T10:00:00.000Z"
  },
  "group": {
    "id": "abc123xy",
    "name": "Team Rocket",
    "description": "Blasting off at the speed of light",
    "createdAt": "2026-05-17T09:00:00.000Z"
  }
}
```
