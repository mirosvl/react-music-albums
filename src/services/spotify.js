// src/services/spotify.js
// PKCE Spotify Auth Service — clean version

// Utilities
function getRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return hash;
}

function base64urlencode(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Environment variables
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI =
  import.meta.env.VITE_APP_REDIRECT_URI || "https://react-music-albums2.vercel.app";

if (!CLIENT_ID) {
  console.error("VITE_SPOTIFY_CLIENT_ID is not set in environment variables.");
}
if (!REDIRECT_URI) {
  console.error("VITE_APP_REDIRECT_URI is not set in environment variables.");
}

// Start login flow
export async function startAuth() {
  if (!CLIENT_ID || !REDIRECT_URI) {
    alert("Spotify Client ID or Redirect URI not set.");
    return;
  }

  const code_verifier = getRandomString(128);
  const challengeBuffer = await sha256(code_verifier);
  const code_challenge = base64urlencode(challengeBuffer);

  sessionStorage.setItem("pkce_code_verifier", code_verifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: "user-read-private user-read-email",
    redirect_uri: REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge,
  });

  console.log("Redirect URI used:", REDIRECT_URI);
  console.log("Full Spotify login URL:", `https://accounts.spotify.com/authorize?${params.toString()}`);

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Exchange code for token
export async function fetchToken(code) {
  const code_verifier = sessionStorage.getItem("pkce_code_verifier");
  if (!code_verifier) throw new Error("Code verifier not found in sessionStorage.");

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token request failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  sessionStorage.setItem("spotify_token", data.access_token);
  return data.access_token;
}

export function getToken() {
  return sessionStorage.getItem("spotify_token");
}