import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Album from './pages/Album'
import Playlist from './pages/Playlist'
import Callback from './pages/Callback'
import { startAuth, getToken } from './services/spotify'
import { Navbar, Container, Nav, Button } from 'react-bootstrap'

export default function App() {
  const loggedIn = !!getToken()

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Music Albums</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/playlist">Playlist</Nav.Link>
            {!loggedIn && <Button onClick={startAuth} variant="success">Login with Spotify</Button>}
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/album/:id" element={<Album />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </Container>
    </>
  )
}