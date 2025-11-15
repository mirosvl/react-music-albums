import React, { useEffect, useState } from 'react';
import { startAuth, fetchToken, getToken } from './services/spotify';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if Spotify redirected back with code
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      fetchToken(code)
        .then((token) => {
          console.log('Spotify token received:', token);
          setIsLoggedIn(true);
          // Clean URL so ?code=... disappears
          window.history.replaceState({}, document.title, '/');
        })
        .catch((err) => {
          console.error('Error fetching Spotify token:', err);
        });
    } else {
      // Check if token already exists
      const existingToken = getToken();
      if (existingToken) {
        setIsLoggedIn(true);
      }
    }
  }, []);

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
        <p>You are logged in! Now you can use the app features.</p>
      )}
    </div>
  );
}

export default App;