# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Bilingual support (English/Spanish) with language toggle in header and login page
- `LanguageContext` with `useLanguage` hook for i18n state management
- Typed translation system (`src/i18n/translations.ts`) with full Spanish and English translations
- `LanguageToggle` component — persists language preference to localStorage
- Shared `date-utils` module — centralizes date formatting logic (DRY refactor)

### Changed

- Replaced all personal references (Maredy, Hamid, "Mi Mama", "El Hombre Ideal") with universal therapeutic terms
- Exercise 2 renamed from "Mi Mama" to "Vinculo Significativo" / "Significant Bond"
- Exercise 3 renamed from "El Hombre Ideal" to "Expectativas Idealizadas" / "Idealized Expectations"
- All exercise descriptions and guiding questions rewritten for universal audience
- All hardcoded Spanish strings extracted to translation system
- Updated unit tests to reflect new universal exercise names
- Comprehensive unit test suite (129 tests) — 100% line and function coverage
- `data-testid` attributes on all interactive UI elements for E2E reliability
- E2E test suite (15 tests): auth flow, theme toggle, language toggle, SPA navigation
- E2E selector registry documentation (`docs/E2E_SELECTORS.md`)
- Unit tests for all components, contexts, utilities, and i18n modules

## [0.2.0] - 2026-02-25

### Added

- Fyrre Magazine editorial design system with General Sans typeface
- Light/dark theme toggle with system preference detection and localStorage persistence
- CSS View Transitions API for smooth tab switching
- `@starting-style` entrance animations for dialogs
- Scroll-driven animations and staggered card entrances
- Marquee ticker in header
- Personalized time-of-day greeting (Buenos dias/tardes/noches)
- Progressive disclosure for exercise instructions (collapsible guide)
- Empathetic empty states with encouraging messaging
- Accessibility: focus-visible rings, selection color, button press states
- CI changelog enforcement — PRs must update CHANGELOG.md
- Deploy workflow publishes GitHub release with changelog notes

### Changed

- Redesigned all components with Fyrre Magazine editorial aesthetic
- Switched from hardcoded warm palette to semantic CSS token system
- Typography: General Sans for UI, Georgia serif for journal content
- Relative date labels ("Hoy", "Ayer") for recent entries
- Improved release notes extraction with commit-log fallback

## [0.1.0] - 2026-02-25

### Added

- Project scaffolding with Vite + React 19 + TypeScript (strict)
- Tailwind CSS v4 with dark warm theme
- Firebase integration (Google Auth + Firestore)
- Exercise 1 "Dos Banderas": structured entries with estrellas, madeja, aprendizaje
- Exercise 2 "Mi Mama": freeform journal entries
- Exercise 3 "El Hombre Ideal": freeform reflection entries
- Real-time data sync via Firestore `onSnapshot`
- Per-user data isolation with Firestore security rules
- ESLint + Prettier + Husky pre-commit hooks
- Unit tests with Vitest + React Testing Library
- E2E tests with Playwright
- GitHub Actions CI (lint, format, typecheck, test, build)
- GitHub Actions deploy to GitHub Pages
