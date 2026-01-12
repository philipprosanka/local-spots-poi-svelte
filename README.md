# Local Spots POI – Frontend

This is the frontend for the Local Spots POI project, built with [SvelteKit](https://kit.svelte.dev/).

## Features

- **Single Chart Type**: Simple chart visualization
- **Maps with Layers**: Categories as map layers
- **Single Images per POI**: Each POI can have one image
- **Secure Passwords**: Passwords are hashed and salted
- **Modern Architecture**: Built with SvelteKit

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
- `src/lib/components/` – Reusable components (e.g., Navbar)
- `src/app.css` – Global styles (e.g., Bulma)
- `src/lib/runes.svelte` – Authentication and user state

## Authentication

- Passwords are securely hashed and salted (see backend).
- Login state is managed via `auth` and `userState`.

## Deployment

For production:
```bash
npm run build
npm run preview
```


**Note:** This frontend requires a matching backend for full functionality.
