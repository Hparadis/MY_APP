import React, { useState, useEffect } from 'react'
import { QrCode, BookOpen, Users } from 'lucide-react'
import ContactsPage from './pages/ContactsPage.jsx'
import QRPage from './pages/QRPage.jsx'
import IdeasPage from './pages/IdeasPage.jsx'

const TABS = [
  { id: 'contacts', label: 'Contacts', Icon: Users },
  { id: 'qr',       label: 'My QR',    Icon: QrCode },
  { id: 'ideas',    label: 'Ideas',    Icon: BookOpen },
]

export default function App() {
  const [active, setActive] = useState('contacts')
  const [prev, setPrev]     = useState(null)

  function navigate(id) {
    if (id === active) return
    setPrev(active)
    setActive(id)
  }

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>

      {/* Pages */}
      {active === 'contacts' && <ContactsPage key="contacts" className="page page-enter" />}
      {active === 'qr'       && <QRPage       key="qr"       className="page page-enter" />}
      {active === 'ideas'    && <IdeasPage    key="ideas"    className="page page-enter" />}

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`nav-btn ${active === id ? 'active' : ''}`}
            onClick={() => navigate(id)}
            aria-label={label}
          >
            <Icon
              size={22}
              strokeWidth={active === id ? 2 : 1.5}
            />
            <span>{label}</span>
          </button>
        ))}
      </nav>

    </div>
  )
}
