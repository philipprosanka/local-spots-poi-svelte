# Local Spots POI – Frontend

This is the frontend for the Local Spots POI project, built with [SvelteKit](https://kit.svelte.dev/).

## Features

### Level 1 & 2 (Backend)
- Backend implemented in Hapi and Node.js

### Level 3
- **Single Chart Type**: Simple chart visualization
- **Maps with Layers**: Categories as map layers
- **Single Images per POI**: Each POI can have one image
- **Secure Passwords**: Passwords are hashed and salted
- **Modern Architecture**: Built with SvelteKit

### Level 4
- **Multiple/Rich Chart Types**: Support for various chart types (bar, line, pie, etc.) for richer data visualization
- **Multiple Maps per Page**: Display several maps on a single page, each with independent layers and controls
- **Multiple Images per POI**: Each Point of Interest can have several images attached and displayed in a gallery
- **SSR (Server-Side Rendering)**: Improved SEO and performance through SvelteKit SSR
- **OAuth Integration (SSR/Backend)**: Secure authentication with OAuth providers (e.g., Google, GitHub) handled server-side

### Level 5
- **Backend in TypeScript**: The backend is now fully migrated to TypeScript for better type safety and maintainability
- **Comprehensive Backend Tests**: Extensive automated tests for backend logic and API endpoints
- **Enhanced CSS Styling**: Improved and consistent UI styling across the application
- **Most Popular Category in Charts**: Analytics now highlight the most popular POI category in chart visualizations

## Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd local-spots-poi-svelte-project/local-spots-svelte
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   - In your browser: [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

## Project Structure

- `src/routes/` – SvelteKit routes and pages
- `src/lib/components/` – Reusable components (e.g., Navbar, ImageGallery, SpotChart)
- `src/app.css` – Global styles (e.g., Bulma)
- `src/lib/runes.svelte` – Authentication and user state

## Authentication

- Passwords are securely hashed and salted (see backend).
- OAuth login with providers like Google and GitHub (handled server-side).
- Login state is managed via `auth` and `userState`.

## Deployment

For production:
```bash
npm run build
npm run preview
```

## Notes

- This frontend requires a matching backend for full functionality.
- For OAuth and SSR features, ensure the backend is running and properly configured.
