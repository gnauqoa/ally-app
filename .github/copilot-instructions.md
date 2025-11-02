## Quick orientation for code-writing agents

This file gives the minimal, actionable knowledge an AI coding agent needs to be productive in this repository.

### Big picture
- Frontend SPA built with React + Ionic (IonReactRouter) + Vite. Native builds use Capacitor (android/).
- State is managed with Redux Toolkit in `src/redux/` (slices under `src/redux/slices`). Async work uses createAsyncThunk.
- API communication is through a single axios instance at `src/config/axios.ts` (request/response interceptors, base URL from `VITE_API_BASE_URL`).

### Key files and patterns (refer to these when changing behavior)
- App entry and routing: `src/App.tsx` (IonRouterOutlet routes, global menu). Update here when adding top-level pages or menu links.
- Store: `src/redux/index.ts` (store config). Note middleware ignores some auth actions — keep action name patterns if you rename thunks.
- Auth slice & storage: `src/redux/slices/authSlice.ts` and `src/lib/auth-storage.ts` (persist/restore auth state). authSlice reads initial state from auth-storage and uses thunks like `login`, `getCurrentUser`.
- API client: `src/config/axios.ts` — handles Authorization header and global 401 behavior (clears storage and redirects to `/login`). Changing this affects all services.
- Services: under `src/services/*` (e.g. `authService.ts`) — they return typed interfaces; they call the shared axios instance and update `auth-storage` when receiving tokens.
- UI components: `src/components/*` and `src/components/ui/*` (button, card, input). Use these instead of ad-hoc HTML where possible.
- Theming: `src/theme/variables.css` and `src/components/theme-provider.tsx`.

### Development and CI workflows
- Local dev: `npm run dev` (starts Vite). For Android device+live-reload: `npm run dev-a` (requires Capacitor/Android SDK).
- Build: `npm run build` (runs `tsc` type-check then `vite build`). Note: TypeScript `noEmit` is set — build relies on Vite.
- Preview: `npm run preview`.
- Unit tests: `npm run test.unit` (Vitest, setup in `vite.config.ts`). Tests run in jsdom; setup file: `src/setupTests.ts`.
- E2E: `npm run test.e2e` (Cypress). Look under `cypress/e2e/`.
- Lint: `npm run lint`.
- Capacitor native commands: `npm run sync-a` and `npm run run-a` for Android — only run on machines with Android SDK and proper environment.

### Conventions and important details
- Path alias: `@/*` maps to `src/*` (see `tsconfig.json`). Use `@/` imports consistently.
- Thunks and action names: many parts depend on thunk action names (e.g., the store's `ignoredActions` uses `auth/login/fulfilled`). If you rename a thunk, update these strings.
- Auth flow: token is persisted via `src/lib/auth-storage.ts`; axios attaches it from there. 401 in axios clears auth and navigates to `/login` — tests and pages expect that behavior.
- Router: project uses `react-router` v5 style Routes + IonReactRouter. Use `useIonRouter()` when programmatic navigation is needed.
- CSS: Tailwind + custom CSS. Utility classes are used widely; prefer `src/components/ui/*` controls for consistent spacing/variants.
- Type safety: `tsconfig.json` sets `strict: true`. Use existing interfaces in `src/services/*` (e.g., `AuthResponse`, `User`) for API shapes.

### Integration points to be careful with
- Native (android/) — modifying Capacitor config or plugins may require `npx cap sync` and native rebuilds. See `capacitor.config.ts` and `android/` folder.
- Environment variables: change API base via `VITE_API_BASE_URL` in environment (Vite .env files) — default is set in `src/config/axios.ts` to a local IP.
- Global error handling: axios response interceptor has global side effects (redirects and auth clearing). When adding global retry or refresh logic, update both `axios.ts` and `authService.refreshToken()` accordingly.

### Small examples for common tasks
- Add new page + route: create `src/pages/<name>/index.tsx`, import the page in `src/App.tsx`, and add a `<Route exact path="/yourpath">` entry in `IonRouterOutlet`.
- Call an authenticated API: add a method to `src/services/<service>.ts` that uses the shared axios instance; return typed interfaces defined alongside the service.
- Persist extra user data: update `src/lib/auth-storage.ts` and `src/redux/slices/authSlice.ts` restore/persist helpers so initial state remains consistent.

### Safety checks before PR / edits
- Run `npm run test.unit` and `npm run lint` locally. For changes touching auth or axios, manually test login -> protected-route navigation.
- When touching routing or Ionic components, run `npm run dev` and exercise the app in browser and (if applicable) on an Android device/emulator for native behavior.

If any of these sections are unclear or you'd like me to expand examples (e.g., a PR template, code snippets for adding a slice or axios token refresh flow), tell me which area to expand.
