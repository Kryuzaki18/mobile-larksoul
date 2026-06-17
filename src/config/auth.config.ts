/**
 * OAuth Configuration
 *
 * SETUP REQUIRED — replace the placeholder strings with your real credentials:
 *
 * Google:
 *  1. Go to Firebase Console > Project Settings > Google Sign-In (or Google Cloud Console > APIs & Services > Credentials)
 *  2. Create an OAuth 2.0 Web Client ID  → GOOGLE_WEB_CLIENT_ID
 *  3. Create an iOS OAuth Client ID      → GOOGLE_IOS_CLIENT_ID
 *  4. Download google-services.json     → android/app/google-services.json
 *  5. Download GoogleService-Info.plist → ios/larksoul/GoogleService-Info.plist
 *  6. Copy the REVERSED_CLIENT_ID from GoogleService-Info.plist → ios/larksoul/Info.plist (CFBundleURLSchemes)
 *
 * Apple (iOS only):
 *  1. In Xcode > Signing & Capabilities, add the "Sign In with Apple" capability.
 *  2. No client ID needed — uses your app's Bundle ID automatically.
 */

// Web (server) OAuth 2.0 client ID — required for both Android and iOS
export const GOOGLE_WEB_CLIENT_ID = '563589011590-7fe0hbkgmdmi9ig7cg84lpeesaudmvl9.apps.googleusercontent.com';

// iOS-specific OAuth 2.0 client ID (from GoogleService-Info.plist → CLIENT_ID).
// Optional — if GoogleService-Info.plist is bundled in the iOS app the SDK
// reads it automatically, so you only need to set this if you want to override it.
export const GOOGLE_IOS_CLIENT_ID: string | undefined = undefined;
