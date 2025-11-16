import React, { useState } from 'react'
import { Form, Row, Col, Button, Card } from 'react-bootstrap'
import AlbumCard from '../shared/AlbumCard'
import { getToken, startAuth, searchAlbums } from '../services/spotify'

export default function Home() {
  const [q, setQ] = useState('')
  const [albums, setAlbums] = useState([])

  async function handleSearch(e) {
    e && e.preventDefault()

    const token = getToken()
    if (!token) {
      startAuth() // Redirect to Spotify login
      return
    }

    try {
      const results = await searchAlbums(q)
      setAlbums(results)
    } catch (err) {
      console.error(err)
      alert("Failed to fetch albums. Try logging in again.")
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <Form onSubmit={handleSearch} className="mb-4">
        <Row>
          <Col md={8}>
            <Form.Control
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search albums or artist..."
            />
          </Col>
          <Col md={4}>
            <Button type="submit">Search</Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => { setQ(''); setAlbums([]) }}
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Form>

      <Row xs={1} sm={2} md={3} lg={4} className="g-3">
        {albums.map(album => (
          <Col key={album.id}>
            <Card>
              {album.images && album.images[0] && (
                <Card.Img variant="top" src={album.images[0].url} alt={album.name} />
              )}
              <Card.Body>
                <Card.Title>{album.name}</Card.Title>
                <Card.Text>
                  {album.artists.map(a => a.name).join(', ')}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}