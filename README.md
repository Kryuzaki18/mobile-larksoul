# Larksoul

A personal journal app built with React Native. Write daily entries, track your mood, and reflect on your thoughts — all stored locally on your device.

---

## Features

- **Journal entries** — Title, free-form thoughts, up to 3 moods, and up to 3 hashtag tags per entry
- **Calendar view** — Browse entries by date with an animated month calendar; swipe or tap arrows to navigate months
- **List / Grid layout toggle** — Switch between a card list and a compact grid on the home screen
- **Mood insights** — Bar chart breakdown of mood frequency over time
- **Authentication** — Email/password, Google Sign-In, Apple Sign-In, and guest mode
- **PIN lock** — Optional PIN to protect the app on resume
- **Theme** — Light, Dark, and system-auto modes
- **Export** — Print or export journal entries
- **Offline-first** — All data stored locally via SQLite; no internet required to read or write

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React Native 0.85 (CLI) |
| Language | TypeScript 5 |
| Styling | NativeWind 4 (Tailwind CSS) |
| Navigation | React Navigation 7 (Native Stack) |
| State | Zustand 5 |
| Database | op-sqlite 16 |
| Animations | React Native Animated API + React Native Reanimated 4 |
| Icons | lucide-react-native |
| Auth | Google Sign-In, Apple Authentication, react-native-keychain |
| Networking | @react-native-community/netinfo |
| Splash screen | react-native-bootsplash |

---

## Project Structure

```
src/
├── database/
│   ├── functions/       # journal, users — CRUD helpers
│   ├── migrations/      # versioned schema migrations
│   └── schemas/         # table definitions with CHECK constraints
├── features/
│   ├── auth/            # Login, Sign Up, PIN lock screens
│   ├── commons/         # Shared Header, NetworkStatusDot
│   ├── home/            # HomeScreen, CalendarView, ListView, GridView, JournalCard
│   ├── insights/        # Insights screen and components
│   ├── journal/         # AddEntryScreen, MoodSelector, TagInput, DatePickerModal
│   └── settings/        # SettingsScreen, SecurityScreen
├── hooks/               # useHomeState, useInsightsGraph
├── models/              # TypeScript interfaces and navigation types
├── navigation/          # RootStack (screen registration + transitions)
├── services/            # auth, session, security services
├── store/               # Zustand stores (auth, theme, security, settings)
└── utils/               # dateTime, mood metadata
```

---

## Getting Started

### Prerequisites

- Node >= 22
- React Native environment set up — follow the [official guide](https://reactnative.dev/docs/set-up-your-environment)
- For iOS: Ruby + CocoaPods

### Install dependencies

```sh
npm install
```

### iOS — install pods

```sh
bundle install
bundle exec pod install
```

### Run

```sh
# Start Metro
npm start

# Android (new terminal)
npm run android

# iOS (new terminal)
npm run ios
```

---

## Database

The app uses op-sqlite with a versioned migration system (`src/database/migrations/index.ts`). The current schema version is tracked in `DB_VERSION`. Migrations run automatically on app start.

Validation is enforced at the app layer (`validateEntryFields` in `src/database/functions/journal.ts`) before any write reaches SQLite:

- Title: 2–30 characters
- Content: 7–300 characters
- Moods: max 3
- Tags: max 3, each 2–15 characters

---

## Navigation Transitions

| Route | Animation |
|---|---|
| Any screen push | Slide from right |
| Insights → Home | Slide from left (pop) |
| Settings → back | Slide to right (pop) |
| Home → Add Entry | Slide from bottom |

---

## Building for Release

```sh
# Android APK
npm run build:android

# Android debug APK
npm run build:android:debug
```

For iOS release builds, archive from Xcode.
