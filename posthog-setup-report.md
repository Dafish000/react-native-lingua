# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into JSM_Lingua, an Expo/React Native language-learning app. Here is a summary of all changes made:

- **`app.config.js`** — Adds `extra.posthogProjectToken` and `extra.posthogHost` fields sourced from environment variables, so the PostHog client reads them at runtime via `expo-constants`.
- **`.env`** — Populated with correct `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values (gitignored).
- **`src/config/posthog.ts`** — PostHog client instance configured from `expo-constants` extras, with app lifecycle event capture, batching, and debug mode in development.
- **`src/app/_layout.tsx`** — App wrapped in `PostHogProvider` (with touch autocapture), and manual screen tracking via `usePathname` + `posthog.screen()` on every route change.
- **`src/app/onboarding.tsx`** — Captures `onboarding_get_started_tapped` when the user presses "Get Started".
- **`src/app/sign-up.tsx`** — Captures `sign_up_completed` (email) and `sign_up_social_completed` (OAuth) after successful sign-up. Calls `posthog.identify()` with the user's email. Adds `posthog.captureException()` in all three error catch blocks (sign-up request, OTP verify, and social OAuth).
- **`src/app/sign-in.tsx`** — Captures `sign_in_completed` (email) and `sign_in_social_completed` (OAuth) after successful sign-in. Calls `posthog.identify()` with the user's email. Adds `posthog.captureException()` in all three error catch blocks (sign-in request, OTP verify, and social OAuth). Fixes a pre-existing lint error (unescaped apostrophe).
- **`src/app/language-select.tsx`** — Captures `language_selected` with `language_code` and `language_name` properties when the user confirms their choice.
- **`src/app/(tabs)/home.tsx`** — Captures `lesson_continue_tapped` (with language, unit, and lesson properties) and `today_plan_item_tapped` (with item_id, title, completion status, and language).

## Events

| Event | Description | File |
|---|---|---|
| `onboarding_get_started_tapped` | User taps "Get Started" on the onboarding screen — top of the sign-up funnel | `src/app/onboarding.tsx` |
| `sign_up_completed` | User successfully completes sign-up via email OTP verification | `src/app/sign-up.tsx` |
| `sign_up_social_completed` | User successfully completes sign-up via social OAuth (Google, Apple, Facebook) | `src/app/sign-up.tsx` |
| `sign_in_completed` | User successfully signs in via email OTP verification | `src/app/sign-in.tsx` |
| `sign_in_social_completed` | User successfully signs in via social OAuth (Google, Apple, Facebook) | `src/app/sign-in.tsx` |
| `language_selected` | User confirms a language selection — critical activation event | `src/app/language-select.tsx` |
| `lesson_continue_tapped` | User taps "Continue" on the current lesson card | `src/app/(tabs)/home.tsx` |
| `today_plan_item_tapped` | User taps a daily plan item (lesson, AI conversation, new words) | `src/app/(tabs)/home.tsx` |
| *(error tracking)* | Auth exceptions captured via `posthog.captureException()` in sign-in and sign-up catch blocks | `src/app/sign-in.tsx`, `src/app/sign-up.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/468978/dashboard/1711462)
- [Onboarding to Sign-up Funnel](https://us.posthog.com/project/468978/insights/lHJawb74)
- [New Sign-ups Over Time](https://us.posthog.com/project/468978/insights/qr5q3SOj)
- [Daily Active Learners](https://us.posthog.com/project/468978/insights/mnSNfETG)
- [Language Adoption Breakdown](https://us.posthog.com/project/468978/insights/TD36b8ee)
- [Sign-ins vs Sign-ups](https://us.posthog.com/project/468978/insights/L35yNFRc)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
