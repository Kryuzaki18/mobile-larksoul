# LarkSoul

> A personal journal app for iOS and Android. Write daily entries, track your mood, and reflect on your thoughts — all stored privately on your device.

---

## Features

| | |
|---|---|
| **Journal entries** | Title, free-form content, up to 3 moods, up to 3 tags, and up to 3 images |
| **Calendar view** | Browse entries by month with swipe navigation |
| **List & Grid layouts** | Toggle between card list and compact grid on the home screen |
| **Mood insights** | Bar chart breakdown of mood frequency over time |
| **Authentication** | Email/password, Google Sign-In, Apple Sign-In, and guest mode |
| **PIN lock** | Optional PIN to protect the app on resume |
| **Themes** | Light, Dark, and system-auto |
| **Export** | Print or export journal entries |
| **Offline-first** | All data stored locally via SQLite — no internet required |

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React Native 0.85 (CLI) |
| Language | TypeScript 5 |
| Styling | NativeWind 4 (Tailwind CSS) |
| Navigation | React Navigation 7 |
| State | Zustand 5 |
| Server state | TanStack Query 5 |
| Database | op-sqlite 16 |
| Animations | Animated API + Reanimated 4 |
| Charts | react-native-svg |
| Icons | lucide-react-native |
| Auth | Google Sign-In · Apple Authentication · react-native-keychain |
| Media | react-native-image-picker |
| Print / Export | react-native-print |

---

## Getting Started

**Prerequisites**
- Node >= 22
- React Native environment — [setup guide](https://reactnative.dev/docs/set-up-your-environment)
- iOS only: Ruby + CocoaPods

```sh
# Install dependencies
npm install

# iOS — install pods
bundle install && bundle exec pod install
```

```sh
# Start Metro
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

---

## Project Structure

```
src/
├── assets/              # Static assets (images, fonts)
├── components/          # Shared UI components
├── config/              # App-wide configuration constants
├── database/
│   ├── functions/       # CRUD helpers for journal and users
│   ├── migrations/      # Versioned schema migrations
│   └── schemas/         # Table definitions with CHECK constraints
├── features/
│   ├── auth/
│   │   └── components/  # Login, Sign Up, PIN lock
│   ├── home/
│   │   └── components/  # Calendar, List/Grid views, Journal cards
│   ├── insights/
│   │   └── components/  # Mood chart and insight components
│   ├── journal/
│   │   └── components/  # Add Entry, Mood Selector, Tag Input, Date Picker
│   └── settings/
│       └── components/  # Settings and Security screens
├── hooks/               # Shared custom hooks
├── navigation/          # RootStack with screen transitions
├── services/            # Auth, session, and security services
├── store/               # Zustand stores (auth, theme, security, settings)
├── types/               # TypeScript interfaces and navigation types
└── utils/
    └── themes/          # Theme tokens and helpers
```

---

## Database

Uses **op-sqlite** with a versioned migration system. Migrations run automatically on app start, tracked by `DB_VERSION` in `src/database/migrations/index.ts`.

Entry validation runs before any write:

| Field | Constraint |
|---|---|
| Title | 2–30 characters |
| Content | 7–300 characters |
| Moods | Max 3 |
| Tags | Max 3, each 2–15 characters |
| Images | Max 3 |

---

## Building for Release

```sh
# Android release APK
npm run build:android

# Android debug APK
npm run build:android:debug
```

For iOS, archive via Xcode.
