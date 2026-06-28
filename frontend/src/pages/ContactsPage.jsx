import React, { useState } from 'react'
import { Phone, PhoneOff, ChevronRight, X, Instagram, Twitter, Linkedin, Globe, Mail } from 'lucide-react'
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
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')
}

function ContactCard({ contact, onOpen }) {
  return (
    <div className="contact-card" onClick={() => onOpen(contact)}>
      <div className="contact-avatar">
        {initials(contact.name)}
      </div>
      <div className="contact-info">
        <p className="contact-name">{contact.name}</p>
        <p className="contact-number">{contact.contact}</p>
      </div>
      <div className="contact-actions" onClick={e => e.stopPropagation()}>
        <a
          href={`tel:${contact.contact}`}
          className="action-btn call"
          aria-label="Call"
        >
          <Phone size={16} strokeWidth={2} />
        </a>
        <button
          className="action-btn decline"
          aria-label="Not now"
        >
          <PhoneOff size={16} strokeWidth={2} />
        </button>
      </div>
      <ChevronRight size={16} color="var(--gray-300)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
    </div>
  )
}

function ContactDetail({ contact, onClose }) {
  const hasSocials = contact.socials && Object.values(contact.socials).some(v => v)

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" onClick={e => e.stopPropagation()}>

        <div className="detail-drag-bar" />

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
                <a
                  key={key}
                  href={key === 'email' ? `mailto:${val}` : val}
                  target="_blank"
                  rel="noreferrer"
                  className="social-row"
                >
                  {Icon && <Icon size={18} strokeWidth={1.5} />}
                  <span>{val}</span>
                  <ChevronRight size={14} color="var(--gray-300)" />
                </a>
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

        <button className="detail-close" onClick={onClose}>
          <X size={20} strokeWidth={1.5} />
        </button>

      </div>
    </div>
  )
}

export default function ContactsPage({ className }) {
  const [contacts] = useLocalStorage('contacts', DEMO_CONTACTS)
  const [selected, setSelected] = useState(null)

  return (
    <div className={className}>
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
            <ContactCard key={c.id} contact={c} onOpen={setSelected} />
          ))}
        </div>
      )}

      {selected && (
        <ContactDetail contact={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

// Demo data so the app doesn't feel empty on first open
const DEMO_CONTACTS = [
  {
    id: '1',
    name: 'Amara Ndiaye',
    contact: '+250 788 123 456',
    socials: { instagram: '@amara.nd', linkedin: '', email: 'amara@example.com', website: '' },
    note: 'Met at ALU pitch night',
  },
  {
    id: '2',
    name: 'Kevin Osei',
    contact: '+250 722 987 654',
    socials: { instagram: '', linkedin: 'linkedin.com/in/kevosei', email: '', website: '' },
    note: '',
  },
  {
    id: '3',
    name: 'Priya Sharma',
    contact: '+254 711 555 000',
    socials: {},
    note: 'Investor intro — follow up',
  },
]
