# Exam Timer

A responsive, feature-rich exam timer application built with React and Vite. Track exam duration with multiple timing modes, dark mode support, and a modern UI.

## Features

- **Two Timing Modes**
  - **Start + Duration**: Set exam start time and duration to calculate remaining time
  - **Countdown**: Simple countdown timer with minute precision
- **Dark Mode**: Toggle between light and dark themes
- **Display Options**: Show/hide seconds in timer display
- **Real-time Updates**: Live clock showing current time in start+duration mode
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **No Backend Required**: Runs entirely in the browser

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool with HMR (Hot Module Replacement)
- **CSS3** - Modern styling with CSS variables for theming
- **ESLint** - Code quality

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3001)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Project Structure

```
src/
├── App.jsx          # Main timer component and logic
├── App.css          # App-level styles (minimal)
├── index.css        # Global styles, theme variables, and component styles
├── main.jsx         # React entry point
└── assets/          # Images and other assets
```

## Usage

### Start + Duration Mode

1. Set the exam start time using the time picker
2. Enter the exam duration in minutes
3. The app calculates and displays the end time and remaining time
4. Uses your device's current time for calculations

### Countdown Mode

1. Enter the desired countdown duration in minutes
2. Click "Start" to begin the countdown
3. Click "Stop" to pause
4. The timer automatically stops at 00:00

### Settings

- **Dark Mode**: Toggle in the settings menu (⚙️ button)
- **Show Seconds**: Display seconds in the timer (useful for final minute)
- **Timer Mode**: Switch between Start+Duration and Countdown modes

## Development

### Code Quality

```bash
# Run linter
npm run lint
```

The project uses ESLint with React and React Hooks rules.

### Theming

The app uses CSS variables for theming. Modify colors in `src/index.css`:

- Light mode: `:root` selector
- Dark mode: `body.dark-mode` selector

Key variables:
- `--main-bg`: Background color
- `--card-bg`: Card background
- `--text-color`: Text color
- `--accent`: Primary accent color
- `--danger`: Warning/danger color

## Deployment

The project is configured for GitHub Pages deployment:

```bash
npm run deploy
```

Make sure your repository has GitHub Pages enabled.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT
