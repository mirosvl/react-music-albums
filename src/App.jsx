import React, { useEffect, useState } from 'react';
import { startAuth, fetchToken, getToken } from './services/spotify';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // loading while checking token

  useEffect(() => {
    // Check URL for Spotify code
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      // Exchange code for token
      fetchToken(code)
        .then((token) => {
          console.log('Spotify token received:', token);
          setIsLoggedIn(true);
          // Clean URL so ?code=... disappears
          window.history.replaceState({}, document.title, '/');
        })
        .catch((err) => {
          console.error('Error fetching Spotify token:', err);
        })
        .finally(() => setLoading(false));
    } else {
      // Check if token already exists
      const existingToken = getToken();
      if (existingToken) {
        setIsLoggedIn(true);
      }
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Music Albums App</h1>
      {!isLoggedIn ? (
        <>
          <p>Login with Spotify to continue</p>
          <button
            type="button"
            onClick={startAuth}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#1DB954',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Login with Spotify
          </button>
        </>
      ) : (
        <div>
          <p>You are logged in! 🎵</p>
          <p>Now you can access your Music Albums app features.</p>
          {/* TODO: render your main app screens here */}
        </div>
      )}
    </div>
  );
}

export default App;