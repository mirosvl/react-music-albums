# React Music Albums

## Overview

This is an interactive web application for exploring music albums. Users can search for albums and artists via the Spotify API, view album details, and create a personal playlist using drag-and-drop reordering.

The app is built using **React + Vite**, styled with **React Bootstrap**, and uses **Spotify PKCE authentication** to fetch data from Spotify.

---

## Features

1. **Home / Search**
   - Search albums or artists via Spotify API.
   - Display results in a responsive card grid.
   - Clear search results functionality.

2. **Album Details**
   - View album cover, release date, artists, and track list.
   - Add tracks to a playlist stored in `localStorage`.

3. **Playlist**
   - Display user playlist with draggable reordering.
   - Remove tracks from playlist.
   - Persist playlist in localStorage.

4. **Spotify Authentication**
   - Login via Spotify using PKCE.
   - Access token stored in sessionStorage.
   - Redirect handled automatically via `/callback` route.

---

## Screens

- `/` → Home / Search  
- `/album/:id` → Album details  
- `/playlist` → User playlist  
- `/callback` → Spotify authentication callback  

---

## Libraries Used

- `react`, `react-dom`  
- `react-router-dom` for routing  
- `react-bootstrap` + `bootstrap` for UI  
- `react-beautiful-dnd` for drag-and-drop playlist  
- `axios` for API calls (optional)  
- `vite` + `@vitejs/plugin-react` for dev server and build  

---

## Installation / Running Locally

> Note: Local testing requires environment variables set for Spotify.

```bash
git clone <your_repo_url>
cd react-music-albums
npm install
npm run dev