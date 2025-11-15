# React Music Albums

This is a Vite + React project skeleton that demonstrates a small music albums web app.
It uses React Router, React Bootstrap, react-beautiful-dnd and the Spotify Web API (Authorization Code with PKCE).

## Features
- Home screen: Search for albums (Spotify search API).
- Album screen: View album details and tracks.
- Playlist screen: Save tracks to a local playlist and reorder via drag-and-drop.
- Uses Spotify Authorization Code with PKCE (no client secret required in the browser).

## Setup (required)
1. Install dependencies:
   ```
   npm install
   ```

2. Create a Spotify developer application at https://developer.spotify.com/dashboard
   - Add `http://localhost:5173` as a Redirect URI (or your dev server address).
   - Note the **Client ID**.

3. Create a `.env` file in project root with:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   VITE_APP_REDIRECT_URI=http://localhost:5173
   ```

4. Run the dev server:
   ```
   npm run dev
   ```

5. Open `http://localhost:5173`. Click **Login with Spotify** to authenticate (PKCE flow).

## Notes
- Spotify's Authorization Code with PKCE is used so you do NOT need to store a client secret.
- CORS: Spotify's token endpoint should accept requests from browsers for PKCE exchanges.
- This project is a teaching/demo scaffold. For production, move secrets to a secure backend.

Included in this ZIP:
- project files (excluding node_modules)
- PDF description file (PDF_DESCRIPTION.pdf) — short project description that you can use when submitting.

