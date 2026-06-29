import React, { useState } from 'react'
import { Phone, PhoneOff, ChevronRight, X, Instagram, Twitter, Linkedin, Globe, Mail, AlertTriangle } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import './ContactsPage.css'

const SOCIAL_ICONS = {
  instagram: Instagram,
  twitter:   Twitter,
  linkedin:  Linkedin,
  website:   Globe,
  email:     Mail,
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
}

// ── Task Reminders Banner ──
function TaskBanner({ tasks, onDismiss }) {
  const pending = tasks.filter(t => !t.done)
  if (pending.length === 0) return null
  return (
    <div className="task-banner">
      <div className="task-banner-icon">⚡</div>
      <div className="task-banner-body">
        <p className="task-banner-label">Reminder</p>
        {pending.slice(0, 2).map(t => (
          <p key={t.id} className="task-banner-item">· {t.text}</p>
        ))}
        {pending.length > 2 && (
          <p className="task-banner-more">+{pending.length - 2} more in Ideas</p>
        )}
      </div>
      <button className="task-banner-close" onClick={onDismiss} aria-label="Dismiss">
        <X size={14} strokeWidth={1.5} />
      </button>
    </div>
  )
}

// ── Delete Confirmation Sheet ──
function DeleteConfirm({ contact, onConfirm, onCancel }) {
  return (
    <div className="detail-overlay" onClick={onCancel}>
      <div className="detail-sheet confirm-sheet" onClick={e => e.stopPropagation()}>
        <div className="detail-drag-bar" />
        <div className="confirm-content">
          <div className="confirm-icon">
            <AlertTriangle size={24} strokeWidth={1.5} />
          </div>
          <p className="confirm-title">Delete contact?</p>
          <p className="confirm-sub">
            <strong>{contact.name}</strong> will be removed permanently.
          </p>
          <button className="confirm-delete-btn" onClick={onConfirm}>
            <PhoneOff size={16} strokeWidth={2} />
            Yes, delete
          </button>
          <button className="confirm-cancel-btn" onClick={onCancel}>
            Keep contact
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Contact Card ──
function ContactCard({ contact, onOpen, onDelete }) {
  const [calling, setCalling] = useState(false)

  function handleCall(e) {
    e.stopPropagation()
    setCalling(true)
    setTimeout(() => setCalling(false), 2000)
    window.location.href = `tel:${contact.contact}`
  }

  return (
    <div className="contact-card" onClick={() => onOpen(contact)}>
      <div className="contact-avatar">{initials(contact.name)}</div>
      <div className="contact-info">
        <p className="contact-name">{contact.name}</p>
        <p className="contact-number">{contact.contact}</p>
      </div>
      <div className="contact-actions" onClick={e => e.stopPropagation()}>
        <a
          href={`tel:${contact.contact}`}
          className={`action-btn call ${calling ? 'calling' : ''}`}
          onClick={handleCall}
          aria-label="Call"
        >
          <Phone size={16} strokeWidth={2} />
        </a>
        <button
          className="action-btn decline"
          onClick={e => { e.stopPropagation(); onDelete(contact) }}
          aria-label="Delete"
        >
          <PhoneOff size={16} strokeWidth={2} />
        </button>
      </div>
      <ChevronRight size={16} color="var(--gray-200)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
    </div>
  )
}

// ── Contact Detail Sheet ──
function ContactDetail({ contact, onClose }) {
  const hasSocials = contact.socials && Object.values(contact.socials).some(v => v)
  const [copied, setCopied] = useState(null)

  function copyHandle(val) {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(val)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" onClick={e => e.stopPropagation()}>
        <div className="detail-drag-bar" />
        <button className="detail-close" onClick={onClose}><X size={18} strokeWidth={1.5} /></button>

        <div className="detail-header">
          <div className="detail-avatar">{initials(contact.name)}</div>
          <h2 className="detail-name">{contact.name}</h2>
          <p className="detail-contact">{contact.contact}</p>
        </div>

        <div className="detail-actions">
          <a href={`tel:${contact.contact}`} className="detail-action-btn">
            <Phone size={20} strokeWidth={1.5} />
            <span>Call</span>
          </a>
          <a href={`sms:${contact.contact}`} className="detail-action-btn">
            <Mail size={20} strokeWidth={1.5} />
            <span>Message</span>
          </a>
        </div>

        {hasSocials && (
          <div className="detail-socials">
            <p className="detail-section-label">Socials</p>
            {Object.entries(contact.socials).map(([key, val]) => {
              if (!val) return null
              const Icon = SOCIAL_ICONS[key]
              return (
                <button
                  key={key}
                  className={`social-row ${copied === val ? 'copied' : ''}`}
                  onClick={() => copyHandle(val)}
                >
                  {Icon && <Icon size={18} strokeWidth={1.5} />}
                  <span>{copied === val ? 'Copied!' : val}</span>
                  <ChevronRight size={14} color="var(--gray-200)" />
                </button>
              )
            })}
          </div>
        )}

        {contact.note && (
          <div className="detail-note">
            <p className="detail-section-label">Note</p>
            <p>{contact.note}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Page ──
export default function ContactsPage({ className }) {
  const [contacts, setContacts]           = useLocalStorage('contacts', DEMO_CONTACTS)
  const [ideas]                           = useLocalStorage('ideas', [])
  const [selected, setSelected]           = useState(null)
  const [toDelete, setToDelete]           = useState(null)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  // Tasks = pinned ideas that act as reminders
  const tasks = ideas.filter(i => i.pinned)

  function confirmDelete() {
    setContacts(prev => prev.filter(c => c.id !== toDelete.id))
    setToDelete(null)
  }

  return (
    <div className={className}>
      {!bannerDismissed && (
        <TaskBanner tasks={tasks} onDismiss={() => setBannerDismissed(true)} />
      )}

      <div className="page-header">
        <h1 className="page-title">Contacts</h1>
        <p className="page-subtitle">{contacts.length} people</p>
      </div>

      {contacts.length === 0 ? (
        <div className="empty-state">
          <p>No contacts yet.</p>
          <p className="empty-hint">Share your QR — contacts appear here when people fill your form.</p>
        </div>
      ) : (
        <div className="contacts-list">
          {contacts.map(c => (
            <ContactCard
              key={c.id}
              contact={c}
              onOpen={setSelected}
              onDelete={setToDelete}
            />
          ))}
        </div>
      )}

      {selected && !toDelete && (
        <ContactDetail contact={selected} onClose={() => setSelected(null)} />
      )}

      {toDelete && (
        <DeleteConfirm
          contact={toDelete}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  )
}

const DEMO_CONTACTS = [
  { id: '1', name: 'Amara Ndiaye',  contact: '+250 788 123 456', socials: { instagram: '@amara.nd', email: 'amara@example.com' }, note: 'Met at ALU pitch night' },
  { id: '2', name: 'Kevin Osei',    contact: '+250 722 987 654', socials: { linkedin: 'linkedin.com/in/kevosei' }, note: '' },
  { id: '3', name: 'Priya Sharma',  contact: '+254 711 555 000', socials: {}, note: 'Investor intro — follow up' },
]
