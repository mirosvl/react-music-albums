import React, { useEffect, useState } from 'react';
import { startAuth, fetchToken, getToken } from './services/spotify';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      fetchToken(code)
        .then((token) => {
          console.log('Spotify token received:', token);
          setIsLoggedIn(true);
          window.history.replaceState({}, document.title, '/');
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      const existingToken = getToken();
      if (existingToken) setIsLoggedIn(true);
      setLoading(false);
    }
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Music Albums App</h1>
      {!isLoggedIn ? (
        <>
          <p>Login with Spotify to continue</p>
          <button
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
        <p>You are logged in! 🎵 Now you can access the app features.</p>
      )}
    </div>
  );
}

export default App;