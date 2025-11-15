import React, { useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Container, Navbar, Nav, Button } from 'react-bootstrap'
import Home from './pages/Home'
import Album from './pages/Album'
import Playlist from './pages/Playlist'
import { startAuth, handleRedirect } from './services/spotify'

export default function App(){
  useEffect(() => {
    // If redirected back from Spotify with code, handle it
    const params = new URLSearchParams(window.location.search)
    if (params.get('code')) {
      handleRedirect()
    }
  }, [])

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand as={Link} to="/">Music Albums</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/playlist">Playlist</Nav.Link>
          </Nav>
          <Button onClick={startAuth} variant="outline-success">Login with Spotify</Button>
        </Container>
      </Navbar>
      <Container>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/album/:id" element={<Album/>} />
          <Route path="/playlist" element={<Playlist/>} />
        </Routes>
      </Container>
    </>
  )
}
