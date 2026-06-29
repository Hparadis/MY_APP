import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Check, Instagram, Twitter, Linkedin, Globe, Mail, User, Phone } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import './QRPage.css'

// ← Replace with your actual deployed landing page URL
const LANDING_URL = 'https://my-app-w61v.vercel.app/'

const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'Instagram',  Icon: Instagram, placeholder: '@yourhandle' },
  { key: 'twitter',   label: 'X / Twitter', Icon: Twitter,  placeholder: '@yourhandle' },
  { key: 'linkedin',  label: 'LinkedIn',   Icon: Linkedin,  placeholder: 'linkedin.com/in/...' },
  { key: 'website',   label: 'Website',    Icon: Globe,     placeholder: 'yoursite.com' },
  { key: 'email',     label: 'Email',      Icon: Mail,      placeholder: 'you@example.com' },
]

function ContactForm({ onSaved }) {
  const [contacts, setContacts] = useLocalStorage('contacts', [])
  const [form, setForm] = useState({
    name: '', contact: '',
    socials: { instagram: '', twitter: '', linkedin: '', website: '', email: '' }
  })
  const [saved, setSaved] = useState(false)

  function update(field, val) {
    setForm(f => ({ ...f, [field]: val }))
  }

  function updateSocial(key, val) {
    setForm(f => ({ ...f, socials: { ...f.socials, [key]: val } }))
  }

  function handleSave() {
    if (!form.name.trim() || !form.contact.trim()) return
    const entry = { ...form, id: Date.now().toString(), savedAt: new Date().toISOString() }
    setContacts(prev => [entry, ...prev])
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setForm({ name: '', contact: '', socials: { instagram: '', twitter: '', linkedin: '', website: '', email: '' } })
      onSaved?.()
    }, 1400)
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Add contact</h2>
      <p className="form-subtitle">Fill in your info — I'll save it</p>

      <div className="form-group">
        <div className="input-row">
          <User size={16} color="var(--gray-400)" strokeWidth={1.5} />
          <input
            className="form-input"
            placeholder="Name"
            value={form.name}
            onChange={e => update('name', e.target.value)}
          />
        </div>
        <div className="input-row">
          <Phone size={16} color="var(--gray-400)" strokeWidth={1.5} />
          <input
            className="form-input"
            placeholder="Phone number"
            type="tel"
            value={form.contact}
            onChange={e => update('contact', e.target.value)}
          />
        </div>
      </div>

      <p className="socials-label">Socials <span>(optional)</span></p>
      <div className="form-group">
        {SOCIAL_FIELDS.map(({ key, Icon, placeholder }) => (
          <div className="input-row" key={key}>
            <Icon size={16} color="var(--gray-400)" strokeWidth={1.5} />
            <input
              className="form-input"
              placeholder={placeholder}
              value={form.socials[key]}
              onChange={e => updateSocial(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        className={`save-btn ${saved ? 'saved' : ''} ${!form.name || !form.contact ? 'disabled' : ''}`}
        onClick={handleSave}
        disabled={saved || !form.name.trim() || !form.contact.trim()}
      >
        {saved
          ? <><Check size={18} strokeWidth={2.5} /> Saved</>
          : 'Save contact'
        }
      </button>
    </div>
  )
}

export default function QRPage({ className }) {
  const [view, setView] = useState('qr') // 'qr' | 'form'

  return (
    <div className={className}>
      <div className="page-header">
        <h1 className="page-title">{view === 'qr' ? 'My QR' : 'Add contact'}</h1>
      </div>

      {/* Tab switcher */}
      <div className="qr-tabs">
        <button
          className={`qr-tab ${view === 'qr' ? 'active' : ''}`}
          onClick={() => setView('qr')}
        >
          Show QR
        </button>
        <button
          className={`qr-tab ${view === 'form' ? 'active' : ''}`}
          onClick={() => setView('form')}
        >
          Collect info
        </button>
      </div>

      {view === 'qr' ? (
        <div className="qr-center">
          <div className="qr-card">
            <QRCodeSVG
              value={LANDING_URL}
              size={220}
              bgColor="#ffffff"
              fgColor="#0a0a0a"
              level="M"
            />
          </div>
          {/* <p className="qr-hint">They scan → your landing page opens</p> */}
          <p className="qr-url">{LANDING_URL}</p>
        </div>
      ) : (
        <ContactForm onSaved={() => setView('qr')} />
      )}
    </div>
  )
}
