import React, { useState } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import AlbumCard from '../shared/AlbumCard'
import { searchAlbums, getAccessToken } from '../services/spotify'

export default function Home(){
  const [q, setQ] = useState('')
  const [albums, setAlbums] = useState([])

  async function handleSearch(e){
    e && e.preventDefault()
    const token = getAccessToken()
    if (!token) {
      alert('Please login with Spotify first (top-right).')
      return
    }
    const results = await searchAlbums(q)
    setAlbums(results)
  }

  return (
    <div>
      <Form onSubmit={handleSearch} className="mb-3">
        <Row>
          <Col md={8}>
            <Form.Control value={q} onChange={e=>setQ(e.target.value)} placeholder="Search albums or artist..." />
          </Col>
          <Col md={4}>
            <Button type="submit">Search</Button>
            <Button variant="secondary" className="ms-2" onClick={()=>{setQ(''); setAlbums([])}}>Clear</Button>
          </Col>
        </Row>
      </Form>

      <div className="album-grid">
        {albums.map(a => <AlbumCard key={a.id} album={a} />)}
      </div>
    </div>
  )
}
