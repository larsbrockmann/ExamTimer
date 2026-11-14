# Exam Timer

<p align="left">
  <a href="https://brockmann.one"><img src="https://img.shields.io/badge/website-brockmann.one-2e7dff?style=flat-square" alt="Website" /></a>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-4-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 4" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License: MIT" />
</p>

Minimalist exam timer with live remaining time, countdown support, and dark mode.

Deployed at [brockmann.one](https://brockmann.one).

<p align="center">
  <img src="screenshots/light-mode.png" alt="Light Mode" width="48%" />
  &nbsp;
  <img src="screenshots/dark-mode.png" alt="Dark Mode" width="48%" />
</p>

## Development

```bash
npm install
npm run dev      # Start dev server (http://localhost:3001)
npm run build    # Production build
npm run lint     # Run ESLint
```

## Modes

- **Start + Duration**: Calculates end time and shows live remaining time based on current clock.
- **Countdown**: Simple minute countdown timer with start and stop controls.

## Settings

Click the ⚙️ icon to toggle:
- Dark mode
- Seconds display (auto-activates during the final minute)
- Active timing mode
