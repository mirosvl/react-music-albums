import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function AlbumCard({ album }) {
  return (
    <Card className="mb-3" style={{ width: '12rem', display: 'inline-block', marginRight: '1rem' }}>
      <Card.Img variant="top" src={album.images?.[0]?.url} />
      <Card.Body>
        <Card.Title style={{ fontSize: '0.9rem' }}>{album.name}</Card.Title>
        <Card.Text style={{ fontSize: '0.8rem' }}>{album.artists?.map(a => a.name).join(', ')}</Card.Text>
        <Button as={Link} to={`/album/${album.id}`} size="sm">View</Button>
      </Card.Body>
    </Card>
  )
}