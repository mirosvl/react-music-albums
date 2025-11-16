// src/services/spotify.js
// PKCE Spotify Auth + Album Search Service

// --- Helper functions ---
function getRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let text = ''
  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}

async function sha256(plain) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return await crypto.subtle.digest('SHA-256', data)
}

function base64urlencode(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  bytes.forEach(b => (binary += String.fromCharCode(b)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// --- Environment variables ---
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI

// --- PKCE Authorization ---
export async function startAuth() {
  if (!CLIENT_ID || !REDIRECT_URI) {
    alert('Missing CLIENT_ID or REDIRECT_URI')
    return
  }

  const code_verifier = getRandomString(128)
  sessionStorage.setItem('pkce_code_verifier', code_verifier)

  const challenge = await sha256(code_verifier)
  const code_challenge = base64urlencode(challenge)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'user-read-email user-read-private',
    code_challenge_method: 'S256',
    code_challenge
  })

  window.location.href = `https://accounts.spotify.com/authorize?${params}`
}

// --- Fetch access token using PKCE ---
export async function fetchToken(code) {
  const verifier = sessionStorage.getItem('pkce_code_verifier')
  if (!verifier) throw new Error('Missing PKCE verifier')

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier
  })

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error('Token error: ' + text)
  }

  const data = await res.json()
  sessionStorage.setItem('spotify_token', data.access_token)
  return data.access_token
}

// --- Get current token ---
export const getToken = () => sessionStorage.getItem('spotify_token')

// --- Search albums by query ---
export async function searchAlbums(query) {
  const token = getToken()
  if (!token) throw new Error('Missing Spotify token')

  const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!res.ok) throw new Error('Spotify search failed')
  const data = await res.json()
  return data.albums.items
}

// --- Get a single album by ID ---
export async function getAlbum(id) {
  const token = getToken()
  if (!token) throw new Error('Missing Spotify token')

  const res = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!res.ok) throw new Error('Spotify getAlbum failed')
  return res.json()
}