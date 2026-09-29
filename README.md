# Poll App

Create surveys, share them and watch the results come in live.

![Poll App preview](docs/preview.png)

**Live demo:** [poll-app.lutz-boelling.de](https://poll-app.lutz-boelling.de)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Database](#database)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Author](#author)

## Features

- **Create surveys** with a name, a description, a category and an end date. If you do not pick an end date, the survey runs for 7 days.
- **Several questions per survey**, each with 2–6 answers, as single or multiple choice.
- **Vote** on active surveys. A survey is locked once it has ended or after you have voted on it.
- **Live results:** vote counts update in real time (Supabase Realtime) without reloading the page.
- **Spam protection:** the database accepts only one vote per survey and network.
- **Overview page** with an "Ending soon" section, active/ended tabs and a category filter.
- **Responsive** layout for desktop, tablet and mobile. Hover effects are turned off on touch devices.

## Tech Stack

| Area     | Technology                                              |
| -------- | ------------------------------------------------------- |
| Frontend | [Angular 21](https://angular.dev) (standalone components, signals) |
| Language | TypeScript 5.9                                          |
| Styling  | SCSS (BEM naming)                                       |
| Backend  | [Supabase](https://supabase.com) (PostgreSQL, Realtime)  |
| Tests    | Vitest                                                  |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20.19, 22.12 or newer, with npm
- A free [Supabase](https://supabase.com) project

### Installation

1. Clone the repository and install the dependencies:

   ```bash
   git clone https://github.com/eXactDevFlaw/PollApp.git
   cd PollApp
   npm install
   ```

2. Create your environment file. It holds your Supabase credentials and is **not** committed:

   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   ```

3. Open `src/environments/environment.ts` and fill in `supabaseUrl` and `supabaseKey` (the anon/public key). You can find both in your Supabase dashboard under **Project Settings → API**.

4. Set up the database as described in [Database](#database).

5. Start the development server:

   ```bash
   npm start
   ```

   The app opens at [http://localhost:4200](http://localhost:4200).

## Database

The app uses three tables in Supabase:

| Table       | Columns                                                                      |
| ----------- | ---------------------------------------------------------------------------- |
| `surveys`   | `id`, `name`, `description`, `category`, `end_date`, `status`, `created_at` |
| `questions` | `id`, `survey_id`, `text`, `position`, `allow_multiple`                       |
| `answers`   | `id`, `question_id`, `text`, `position`, `votes`                              |

The database is configured to:

- require an end date, with 7 days as the default
- limit text lengths (name 80, description 500, question 150, answer 100 characters)
- accept votes only through the `vote` function, which validates each vote and allows one vote per survey and IP address
- send changes of the `answers` table via Realtime (live results)

## Scripts

| Command         | Description                                      |
| --------------- | ------------------------------------------------ |
| `npm start`     | Starts the dev server and opens the browser      |
| `npm run build` | Creates a production build in `dist/`            |
| `npm run watch` | Rebuilds automatically on every change           |
| `npm test`      | Runs the unit tests                              |

## Project Structure

```
src/
├── app/
│   ├── core/            # Models, Supabase service, helpers (survey state, votes)
│   ├── features/
│   │   ├── home/            # Overview: hero, "Ending soon", survey list
│   │   ├── create-survey/   # Dialog for creating a new survey
│   │   └── survey-detail/   # Vote on a survey, live results
│   └── shared/          # Reusable components (button, input field, dropdown, …)
├── environments/        # environment.example.ts (template for your credentials)
└── styles.scss          # Global styles and color variables
```

## Author

**Lutz Bölling** – [GitHub @eXactDevFlaw](https://github.com/eXactDevFlaw)
