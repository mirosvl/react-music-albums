import React, { useEffect, useState } from "react";
import { startAuth, getToken } from "../services/spotify";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (getToken()) setLoggedIn(true);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Music Albums App</h1>

      {!loggedIn ? (
        <>
          <p>Login with Spotify to continue</p>
          <button
            onClick={startAuth}
            style={{
              padding: "12px 24px",
              fontSize: 16,
              background: "#1DB954",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Login with Spotify
          </button>
        </>
      ) : (
        <p>You are logged in! 🎵</p>
      )}
    </div>
  );
}