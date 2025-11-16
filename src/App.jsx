import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Album from './pages/Album'
import Playlist from './pages/Playlist'
import Callback from './pages/Callback'
import { getToken, startAuth } from './services/spotify'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/album/:id" element={<Album />} />
        <Route path="/playlist/:id" element={<Playlist />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </BrowserRouter>
  )
}