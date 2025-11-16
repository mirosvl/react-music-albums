import { useEffect } from 'react'
import { fetchToken } from '../services/spotify'

export default function Callback() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      fetchToken(code)
        .then(() => window.location.replace('/'))
        .catch(err => console.error('Token error:', err))
    }
  }, [])

  return <p style={{ marginTop: 40, textAlign: 'center' }}>Authorizing…</p>
}