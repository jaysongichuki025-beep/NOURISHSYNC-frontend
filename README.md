# NourishSync Frontend

NourishSync is a community food network frontend built with React and Tailwind CSS.
It connects donors, claimers, and administrators through a marketplace-style dashboard.

## Getting Started

### Install dependencies

```bash
npm install
```

### Configure environment

Create a `.env` file from the example:

```bash
cp .env.example .env
```

By default, the frontend uses:

```bash
REACT_APP_API_URL=http://localhost:5000
```

### Start development

```bash
npm start
```

Open http://localhost:3000 in your browser.

## Project structure

- `src/App.js` — main app shell and page navigation
- `src/components/` — user-facing pages and UI components
- `src/services/api.js` — backend API helper functions
- `public/` — static HTML and assets

## Available scripts

- `npm start` — run the project in development mode
- `npm run build` — create an optimized production bundle
- `npm test` — run the test suite

## Environment variables

The frontend depends on:

- `REACT_APP_API_URL` — backend API base URL

## Notes for contributors

- This update is documentation-only and does not change UI layout or page flow.
- Work in the `glenn` branch and open a pull request for review.
- If you need to add a feature, keep related UI changes separate from layout updates
