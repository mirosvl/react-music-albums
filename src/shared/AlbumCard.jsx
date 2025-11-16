import React from 'react'

export default function AlbumCard({ album }) {
  return (
    <div className="album-card">
      {album.images && album.images[0] && (
        <img src={album.images[0].url} alt={album.name} />
      )}
      <h5>{album.name}</h5>
      <p>{album.artists.map(a => a.name).join(', ')}</p>
    </div>
  )
}