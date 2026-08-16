# Poké Haus

All 40+ screens from the mockup, wired together with a tiny built-in
navigator (no `react-navigation` dependency needed to preview it).

Open the app and tap **"All screens →"** next to the wordmark on the
Home screen to jump straight to any screen in the app — grouped the
same way as the mockup (Core, Card, Binders, Wishlist, Collection,
Profile/Settings, States & Empty).

## Screens included

**Core** — Splash, Home, Menu, Search, All Sets, Series View, Set
Detail, Set Card Grid, Checklist, Set Filters

**Card** — Card Detail, Card Zoom, Variants, Add to Collection, Edit
Owned Card, Choose Binder

**Binders** — Binders list, Binder Detail, Binder Settings, Cover
Designer

**Wishlist** — Wishlist, Wishlist Detail

**Collection** — My Collection (search/scan), Collection (all cards),
Collection Filters, Collection Overview

**Profile / Settings** — Profile, Appearance, Language, Notifications,
Data & Sync, About

**States & Empty** — Loading, Empty Binders, Empty Wishlist, Empty
Collection, No Search Results, Offline, API Error, Set Complete,
Binder Complete, Card Not Owned

## Fastest way to preview: Expo Snack
1. Go to https://snack.expo.dev
2. Create the same file structure (App.js, theme.js, data.js,
   components/, screens/) and paste each file's contents in.
3. The preview pane updates live — no local install needed.

## Run locally instead
```bash
npx create-expo-app poke-haus
cd poke-haus
# replace the generated App.js and add theme.js, data.js,
# components/, screens/ from this folder
npm install
npx expo start
```
Press `i` for iOS simulator, `a` for Android emulator, `w` for web,
or scan the QR code with the Expo Go app on your phone.

## Notes
- All images are placeholder URLs from `via.placeholder.com` — swap
  them for real card art (local `require()` assets or your own CDN)
  in `data.js`.
- Navigation is a simple in-memory stack in `App.js` (a `SCREENS`
  route table + `navigate('RouteName', params)` / `goBack()`). If you
  want native transitions, swipe-to-go-back, or deep linking, swap it
  for `@react-navigation/native-stack` — the screen components already
  take `navigate` / `goBack` / `params` props so the swap is mostly
  mechanical.
- Most detail screens (Card Detail, Binder Detail, Set Detail, etc.)
  currently show fixed mock data regardless of which item you tapped —
  hook up `params.cardId` / `params.binderId` / etc. to your real data
  source to make them dynamic.
- The "States & Empty" screens (Loading, Offline, API Error, Empty *,
  Set/Binder Complete, Card Not Owned) are standalone illustrations of
  each state — in a real app you'd render them conditionally inside
  the relevant list screen based on your actual data/network state,
  rather than navigating to them as their own route.
- Shared building blocks worth knowing about: `components/TopBar.js`
  (header bar), `components/ProgressBar.js`, `components/FilterChip.js`
  (pill filters), `components/SettingsRow.js` (chevron/switch/value
  rows used throughout Profile/Settings), and `components/EmptyState.js`
  (powers all the States & Empty screens).
