import React, { useState, useRef, useEffect } from 'react'
import { Plus, Pin, Trash2, X } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import './IdeasPage.css'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function IdeaCard({ idea, onPin, onDelete }) {
  return (
    <div className={`idea-card ${idea.pinned ? 'pinned' : ''}`}>
      {idea.pinned && <div className="pin-badge">Pinned</div>}
      <p className="idea-text">{idea.text}</p>
      <div className="idea-footer">
        <span className="idea-time">{timeAgo(idea.createdAt)}</span>
        <div className="idea-actions">
          <button
            className={`idea-btn ${idea.pinned ? 'active' : ''}`}
            onClick={() => onPin(idea.id)}
            aria-label={idea.pinned ? 'Unpin' : 'Pin'}
          >
            <Pin size={14} strokeWidth={idea.pinned ? 2.5 : 1.5} />
          </button>
          <button
            className="idea-btn delete"
            onClick={() => onDelete(idea.id)}
            aria-label="Delete"
          >
            <Trash2 size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function IdeasPage({ className }) {
  const [ideas, setIdeas] = useLocalStorage('ideas', DEMO_IDEAS)
  const [draft, setDraft]   = useState('')
  const [open, setOpen]     = useState(false)
  const textareaRef         = useRef(null)

  const pinned   = ideas.filter(i => i.pinned)
  const unpinned = ideas.filter(i => !i.pinned)

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 80)
  }, [open])

  function addIdea() {
    if (!draft.trim()) return
    const entry = { id: Date.now().toString(), text: draft.trim(), pinned: false, createdAt: new Date().toISOString() }
    setIdeas(prev => [entry, ...prev])
    setDraft('')
    setOpen(false)
  }

  function togglePin(id) {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, pinned: !i.pinned } : i))
  }

  function deleteIdea(id) {
    setIdeas(prev => prev.filter(i => i.id !== id))
  }

  function handleKey(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addIdea()
    if (e.key === 'Escape') { setOpen(false); setDraft('') }
  }

  return (
    <div className={className}>
      <div className="ideas-header">
        <div>
          <h1 className="page-title">Ideas</h1>
          <p className="page-subtitle">{ideas.length} captured</p>
        </div>
        <button className="new-idea-btn" onClick={() => setOpen(true)} aria-label="New idea">
          <Plus size={20} strokeWidth={2} />
        </button>
      </div>

      <div className="ideas-list">
        {pinned.length > 0 && (
          <>
            <p className="ideas-section-label">Pinned</p>
            {pinned.map(i => (
              <IdeaCard key={i.id} idea={i} onPin={togglePin} onDelete={deleteIdea} />
            ))}
          </>
        )}

        {unpinned.length > 0 && (
          <>
            {pinned.length > 0 && <p className="ideas-section-label" style={{ marginTop: 24 }}>All ideas</p>}
            {unpinned.map(i => (
              <IdeaCard key={i.id} idea={i} onPin={togglePin} onDelete={deleteIdea} />
            ))}
          </>
        )}

        {ideas.length === 0 && (
          <div className="empty-state">
            <p>No ideas yet.</p>
            <p className="empty-hint">Tap + to capture something before it disappears.</p>
          </div>
        )}
      </div>

      {/* Compose overlay */}
      {open && (
        <div className="compose-overlay" onClick={() => { setOpen(false); setDraft('') }}>
          <div className="compose-sheet" onClick={e => e.stopPropagation()}>
            <div className="compose-top">
              <span className="compose-label">New idea</span>
              <button className="compose-close" onClick={() => { setOpen(false); setDraft('') }}>
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <textarea
              ref={textareaRef}
              className="compose-input"
              placeholder="What's the idea..."
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKey}
              rows={4}
            />
            <button
              className={`save-btn ${!draft.trim() ? 'disabled' : ''}`}
              onClick={addIdea}
              disabled={!draft.trim()}
            >
              Save idea
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const DEMO_IDEAS = [
  { id: '1', text: 'Build a CLI tool that summarises your week from notes', pinned: true,  createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', text: 'Write a Medium piece on learning chess as an adult', pinned: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', text: 'Dare to Dream onboarding flow — keep it one screen', pinned: false, createdAt: new Date(Date.now() - 172800000).toISOString() },
]
