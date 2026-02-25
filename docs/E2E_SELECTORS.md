# E2E Selector Registry

All `data-testid` attributes used in E2E (Playwright) tests. Every testable UI element must have a `data-testid` to ensure stable, refactor-proof selectors.

## Convention

- Format: `{component}-{element}` (kebab-case)
- All selectors use `page.getByTestId('...')` in Playwright
- Every spec file includes a JSDoc header listing selectors it depends on

---

## Login Page (`LoginPage.tsx`)

| Selector               | Element    | Description                         |
| ---------------------- | ---------- | ----------------------------------- |
| `login-page`           | `<div>`    | Login page root container           |
| `login-title`          | `<h1>`     | App name heading ("Estela")         |
| `login-subtitle`       | `<p>`      | Subtitle text ("Diario de Proceso") |
| `login-sign-in-button` | `<button>` | Google sign-in button               |

**Spec:** `e2e/auth.spec.ts`

---

## App Shell (`AppShell.tsx`)

| Selector       | Element    | Description                                     |
| -------------- | ---------- | ----------------------------------------------- |
| `app-shell`    | `<div>`    | Main app container (post-login)                 |
| `app-marquee`  | `<div>`    | Scrolling ticker bar                            |
| `app-title`    | `<h1>`     | App title in header ("Estela")                  |
| `app-greeting` | `<p>`      | Personalized greeting (e.g. "Buenos dias, Ana") |
| `app-sign-out` | `<button>` | Sign out button                                 |

---

## Exercise Tabs (`ExerciseTabs.tsx`)

| Selector           | Element     | Description                       |
| ------------------ | ----------- | --------------------------------- |
| `exercise-tab-bar` | `<nav>`     | Tab navigation bar                |
| `tab-exercise1`    | `<button>`  | Tab for exercise 1 (Dos Banderas) |
| `tab-exercise2`    | `<button>`  | Tab for exercise 2 (Freeform)     |
| `tab-exercise3`    | `<button>`  | Tab for exercise 3 (Freeform)     |
| `tab-content`      | `<section>` | Active tab content container      |

---

## Entry Card (`EntryCard.tsx`)

| Selector             | Element     | Description                                   |
| -------------------- | ----------- | --------------------------------------------- |
| `entry-card`         | `<article>` | Entry card wrapper                            |
| `entry-card-toggle`  | `<button>`  | Expand/collapse toggle button                 |
| `entry-card-content` | `<div>`     | Expanded content area (hidden when collapsed) |

---

## Dos Banderas (`DosBanderas.tsx`)

| Selector                    | Element    | Description                     |
| --------------------------- | ---------- | ------------------------------- |
| `dos-banderas-guide-toggle` | `<button>` | Show/hide exercise instructions |
| `dos-banderas-guide`        | `<div>`    | Exercise instructions content   |
| `dos-banderas-add`          | `<button>` | Add new daily record button     |

---

## Freeform Exercise (`FreeformExercise.tsx`)

| Selector                | Element    | Description                     |
| ----------------------- | ---------- | ------------------------------- |
| `freeform-guide-toggle` | `<button>` | Show/hide exercise instructions |
| `freeform-guide`        | `<div>`    | Exercise instructions content   |
| `freeform-add`          | `<button>` | Add new freeform entry button   |

---

## Confirm Dialog (`ConfirmDialog.tsx`)

| Selector                  | Element    | Description                  |
| ------------------------- | ---------- | ---------------------------- |
| `confirm-dialog-backdrop` | `<div>`    | Full-screen backdrop overlay |
| `confirm-dialog`          | `<div>`    | Dialog panel                 |
| `confirm-dialog-message`  | `<p>`      | Confirmation message text    |
| `confirm-dialog-cancel`   | `<button>` | Cancel button                |
| `confirm-dialog-confirm`  | `<button>` | Confirm/delete button        |

---

## Empty State (`EmptyState.tsx`)

| Selector      | Element | Description                        |
| ------------- | ------- | ---------------------------------- |
| `empty-state` | `<div>` | Empty state container with message |

---

## Theme Toggle (`ThemeToggle.tsx`)

| Selector       | Element    | Description                   |
| -------------- | ---------- | ----------------------------- |
| `theme-toggle` | `<button>` | Light/dark mode toggle button |

**Spec:** `e2e/theme.spec.ts`

---

## Language Toggle (`LanguageToggle.tsx`)

| Selector          | Element    | Description                                         |
| ----------------- | ---------- | --------------------------------------------------- |
| `language-toggle` | `<button>` | ES/EN language toggle (shows target language label) |

**Spec:** `e2e/language.spec.ts`

---

## Protected Route (`ProtectedRoute.tsx`)

| Selector         | Element | Description                                     |
| ---------------- | ------- | ----------------------------------------------- |
| `loading-screen` | `<div>` | Full-screen loading spinner while auth resolves |

---

## E2E Spec Coverage

| Spec File            | Tests | Selectors Used                                                                                           |
| -------------------- | ----- | -------------------------------------------------------------------------------------------------------- |
| `auth.spec.ts`       | 4     | `login-page`, `login-title`, `login-subtitle`, `login-sign-in-button`, `theme-toggle`, `language-toggle` |
| `theme.spec.ts`      | 4     | `theme-toggle`, `html.dark` (class)                                                                      |
| `language.spec.ts`   | 4     | `language-toggle`, `login-sign-in-button`, `login-subtitle`                                              |
| `navigation.spec.ts` | 3     | `login-page`, `login-title`                                                                              |
