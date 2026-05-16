# Membership Sync

The **Membership Sync** feature solves a common PWA issue: state isolation between browser engines.

## The Problem

When a user opens a ColegaPoints invite link in a mobile browser (like Chrome, Safari, or an in-app browser from Instagram/WhatsApp) and joins a group, their membership is saved in that browser's `localStorage`.

If they then install the PWA or open the app, they'll find their group list empty because the PWA uses a separate storage instance (especially on iOS).

## The Solution: Sync Codes

We use short-lived **Sync Codes** to securely transfer membership data between browsers.

### How it works

1. **Generate Code**: In the browser where you joined the group, go to the Group page. You'll see a **"Sync to App"** section. Click "Get Sync Code".
2. **Copy Code**: A 6-digit code (e.g., `AB12XY`) is generated and linked to your member profile.
3. **Redeem in App**: Open the ColegaPoints PWA/App. On the Home screen, find the **"Sync existing group"** section.
4. **Success**: Enter the code and click "Sync". The app will fetch your member profile and group details, saving them locally.

## Technical Details

- **Expiration**: Codes expire after 10 minutes.
- **One-time use**: Once a code is redeemed, it is deleted from the database.
- **Security**: Codes are 6-character alphanumeric strings (using a non-ambiguous alphabet) linked to a specific `memberId` and `groupId`.

## Frequently Asked Questions

### Does this share my password?

ColegaPoints is designed to be anonymous and password-less. The sync code simply transfers your "identity" (ID, name, and emoji) to the new browser.

### What if the code expires?

Just click "Get Sync Code" again in the original browser to generate a new one.
