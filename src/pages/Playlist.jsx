import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export default function Playlist() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem('playlist') || '[]')
    setItems(p)
  }, [])

  function onDragEnd(result) {
    if (!result.destination) return
    const newItems = Array.from(items)
    const [moved] = newItems.splice(result.source.index, 1)
    newItems.splice(result.destination.index, 0, moved)
    setItems(newItems)
    localStorage.setItem('playlist', JSON.stringify(newItems))
  }

  function remove(idx) {
    const copy = Array.from(items)
    copy.splice(idx, 1)
    setItems(copy)
    localStorage.setItem('playlist', JSON.stringify(copy))
  }

  return (
    <div>
      <h4>Your Playlist</h4>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="pl">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items.map((it, idx) => (
                <Draggable key={it.id || idx} draggableId={String(it.id || idx)} index={idx}>
                  {(prov) => (
                    <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="album-card mb-2">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{it.name}</strong><br />
                          <small>{it.artists}</small>
                        </div>
                        <div>
                          <Button variant="danger" size="sm" className="ms-2" onClick={() => remove(idx)}>Remove</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}