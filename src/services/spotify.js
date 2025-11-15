// Spotify service with PKCE (Authorization Code with PKCE).
// Requires VITE_SPOTIFY_CLIENT_ID and VITE_APP_REDIRECT_URI env vars (Vite exposes as import.meta.env).
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_APP_REDIRECT_URI || window.location.origin
const SCOPES = 'user-read-private user-read-email'

function base64urlencode(str){
  return btoa(String.fromCharCode.apply(null,new Uint8Array(str)))
    .replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
}

async function sha256(plain){
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return new Uint8Array(hash)
}

function getRandomString(length=56){
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let text = ''
  for (let i=0;i<length;i++) text += possible.charAt(Math.floor(Math.random()*possible.length))
  return text
}

export async function startAuth(){
  if (!CLIENT_ID) {
    alert('Set VITE_SPOTIFY_CLIENT_ID in .env and restart the dev server.')
    return
  }
  const code_verifier = getRandomString(128)
  const challengeBytes = await sha256(code_verifier)
  const code_challenge = base64urlencode(challengeBytes)
  sessionStorage.setItem('pkce_code_verifier', code_verifier)
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge
  })
  window.location = `https://accounts.spotify.com/authorize?${params.toString()}`
}

async function exchangeCodeForToken(code, code_verifier){
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier
  })
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: body.toString()
  })
  if (!res.ok) throw new Error('Token exchange failed: ' + res.status)
  return res.json()
}

export async function handleRedirect(){
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const code_verifier = sessionStorage.getItem('pkce_code_verifier')
  if (!code || !code_verifier) return
  try {
    const tokenResp = await exchangeCodeForToken(code, code_verifier)
    sessionStorage.setItem('spotify_token', JSON.stringify(tokenResp))
    // remove code from url
    params.delete('code'); params.delete('state')
    const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '')
    window.history.replaceState({}, '', newUrl)
    alert('Logged in successfully. Token stored in sessionStorage.')
  } catch (e){
    console.error(e)
    alert('Authentication failed: '+ e.message)
  }
}

export function getAccessToken(){
  try {
    const raw = sessionStorage.getItem('spotify_token')
    if (!raw) return null
    const t = JSON.parse(raw)
    if (Date.now()/1000 > (t.expires_at || (t.expires_in + Math.floor(Date.now()/1000)))) {
      // no refresh implemented here
      return null
    }
    return t.access_token || t.accessToken || t.access_token
  } catch { return null }
}

async function apiGet(path, params = {}){
  const token = getAccessToken()
  if (!token) throw new Error('No access token')
  const url = new URL('https://api.spotify.com/v1/' + path)
  Object.keys(params).forEach(k => url.searchParams.set(k, params[k]))
  const res = await fetch(url.toString(), {
    headers: { Authorization: 'Bearer ' + token }
  })
  if (!res.ok) throw new Error('Spotify API error: ' + res.status)
  return res.json()
}

export async function searchAlbums(query){
  if (!query) return []
  const data = await apiGet('search', { q: query, type: 'album', limit: '20' })
  return data.albums.items
}

export async function getAlbum(id){
  return apiGet('albums/' + id)
}
