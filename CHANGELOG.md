# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
