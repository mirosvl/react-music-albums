import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function AlbumCard({ album }){
  const img = album.images && album.images[0] ? album.images[0].url : ''
  return (
    <Card className="album-card">
      {img && <Card.Img variant="top" src={img} alt={album.name} />}
      <Card.Body>
        <Card.Title style={{fontSize: '1rem'}}>{album.name}</Card.Title>
        <Card.Text style={{fontSize: '.85rem'}}>{album.artists?.map(a=>a.name).join(', ')}</Card.Text>
        <Button as={Link} to={`/album/${album.id}`} size="sm">Open</Button>
      </Card.Body>
    </Card>
  )
}
