# My Muscle Diet

A premium, mobile-first React application acting as a personal weekly diet chart for a gym bulking program. The app tracks daily meals, protein intake against a 130g target, and categorizes days into "Veg" and "Egg" plans. It features a sleek dark-mode UI with sophisticated micro-interactions.

---

## 🚀 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (Custom configured for specific dark mode aesthetics and animations)
- **Typography**: Inter (Weights 400, 600, 700, 900 via Google Fonts)

---

## 📂 Project Structure & Architecture

Because this is a static, deploy-ready application, there is **no backend**. All data is completely hardcoded into a single source of truth (`src/data.js`).

### Entry Points
- `index.html`: The HTML shell. Imports the `Inter` font family and applies the global dark background (`bg-[#0f0f0f] text-[#e5e5e5]`).
- `src/main.jsx`: React bootstrapper.
- `src/index.css`: Imports Tailwind directives and provides a custom utility `.hide-scrollbar` to hide native scrollbars while preserving scrollability.

### Main App (`src/App.jsx`)
The orchestration layer. 
- Automatically detects the current day on load using `new Date().getDay()`.
- Retrieves the selected day's plan from `data.js`.
- Dynamically calculates the total protein for the selected day by reducing through the meal items.
- Controls the "Back to Today" floating button.
- Handles layout constraints (`max-w-md` and safe-area padding `pb-8` for mobile-first rendering).

---

## 📊 Data Layer (`src/data.js`)

This file is the backbone of the application. It contains:
1. `DAYS`: An array mapping standard days (Mon-Sun) to their types (`Veg` or `Egg`).
2. `TARGET_PROTEIN`: A constant set to `130`.
3. `WEEK_PLAN`: An object keyed by the short day ID (e.g., `Mon`, `Tue`). Each day contains:
   - `type`: String ('Egg' or 'Veg').
   - `note`: A string reminder for night prep (e.g., "Soak moong tonight").
   - `meals`: An array of 5 standard meals:
     1. Breakfast (7:00 AM)
     2. Mid-morning snack (10:30 AM)
     3. Lunch (2:00 PM)
     4. Evening / Post-gym (5:30 PM)
     5. Dinner (9:00 PM)
   - **Items**: Each meal has an `items` array. Every item tracks `name`, `protein` (in grams), and a `tag` (`ADD` for new diet additions, `existing` for pre-existing diet items).
   
*Note: Strict non-veg items (Chicken, Mutton, Fish) are exclusively scheduled for Dinner, while vegetarian proteins like Soya Chunks are eaten during Lunch on those days.*

---

## 🧩 Components Overview (`src/components/`)

### `Header.jsx`
- Displays the "MY MUSCLE DIET" branding using `Inter 900` font weight.
- Includes a 🔥 icon and a green accent subtitle.

### `DaySelector.jsx`
- A horizontal, scrollable list of pill buttons for all 7 days.
- **Interactions**: Tapping a pill triggers a scale bounce (`active:scale-95`).
- **Logic**: Uses a `useRef` and `scrollIntoView` to automatically center the active day when it changes.
- **Styling**: The active pill is colored based on the day type (Amber for Egg, Bright Green for Veg).

### `DaySummary.jsx` (Hero Card)
- A large visual summary at the top of the day.
- **Dynamic Greeting**: Randomly selects a motivational phrase on render.
- **Count-Up Animation**: Uses a custom `useCountUp` hook with `requestAnimationFrame` to animate the large protein number from `0` to the actual total.
- **Progress Bar**: A glowing green bar that animates its width to show progress toward the 130g goal.

### `MealCard.jsx`
- Iterates over the items for a specific meal.
- **Badges**: Highlights items tagged `ADD` with a glowing green badge. `existing` items use a muted dark gray badge.
- **Animations**: Uses inline `animationDelay` mapped to the array index to create a staggered fade-slide-up entrance effect (`animate-fade-slide-up`).
- **Borders**: Left border is tinted green or amber based on the day type.

### `BottomSummary.jsx` (Daily Target Card)
- **SVG Circular Progress**: Renders an SVG ring. The `strokeDashoffset` is animated on load to trace the circle up to the completion percentage.
- **Conditional UI**: Shows a "Target crushed!" checkmark if protein >= 130g, otherwise shows "Xg more to go".
- **Styling**: Uses a dark green to black gradient background with a glowing green border.

### `NightReminder.jsx`
- A dark-amber styled card with a moon icon.
- Displays the `note` from the `WEEK_PLAN` data to remind the user of preparations needed before sleeping.

---

## 🎨 Design System & Tailwind Config

Configured in `tailwind.config.js`:
- **Colors**:
  - `app-bg`: `#0f0f0f` (Main background)
  - `app-card`: `#1a1a1a` (Card backgrounds)
  - `app-border`: `#2a2a2a`
  - `app-green`: `#22c55e` (Primary bright accent)
  - `app-amber`: `#facc15` (Secondary accent for Egg days)
  - `app-text`: `#e5e5e5`
  - `app-muted`: `#6b7280`
- **Animations**:
  - `fade-slide-up`: For cascading meal cards.
  - `bounce-scale`: For tactile button presses.
  - `pulse-slow`: For the "Back to Today" floating button.
