import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAlbum } from '../services/spotify'
import { Button, Row, Col } from 'react-bootstrap'

export default function Album() {
  const { id } = useParams()
  const [album, setAlbum] = useState(null)

  useEffect(() => {
    async function load() {
      const a = await getAlbum(id)
      setAlbum(a)
    }
    load()
  }, [id])

  function addTrackToPlaylist(track) {
    const existing = JSON.parse(localStorage.getItem('playlist') || '[]')
    existing.push({
      id: track.id,
      name: track.name,
      artists: track.artists.map(a => a.name).join(', ')
    })
    localStorage.setItem('playlist', JSON.stringify(existing))
    alert('Added to playlist.')
  }

  if (!album) return <div>Loading...</div>

  return (
    <div>
      <Row>
        <Col md={4}>
          <img src={album.images?.[0]?.url} alt={album.name} style={{ width: '100%' }} />
        </Col>
        <Col md={8}>
          <h3>{album.name}</h3>
          <p>{album.artists?.map(a => a.name).join(', ')}</p>
          <p>Release: {album.release_date}</p>
          <h5>Tracks</h5>
          <ol>
            {album.tracks.items.map(track => (
              <li key={track.id}>
                {track.name} - {track.artists.map(a => a.name).join(', ')}
                <Button size="sm" className="ms-2" onClick={() => addTrackToPlaylist(track)}>Add</Button>
              </li>
            ))}
          </ol>
        </Col>
      </Row>
    </div>
  )
}