import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const statusStyles = {
  lost: 'bg-red-50 text-red-700 border border-red-200',
  found: 'bg-green-50 text-green-700 border border-green-200',
  returned: 'bg-[#f5f5f3] text-[#6b6b6b] border border-[#d4d4d2]',
}

export default function ItemDetailModal({ item, onClose, onMarkReturned }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  if (!item) return null

  const isOwner = user?.uid === item.postedBy

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi! I saw your post on the VES Lost & Found portal about "${item.name}". I think it might be mine.`
    )
    window.open(`https://wa.me/91${item.finder.phone}?text=${msg}`, '_blank')
  }

  const handleViewProfile = () => {
    onClose()
    navigate(`/profile/${item.postedBy}`)
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={onClose}
    >
      <div
        style={{ background: 'white', borderRadius: '1rem', width: '100%', maxWidth: '28rem', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '1.5rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1a1a1a', paddingRight: '1rem' }}>
              {item.name}
            </h2>
            <button
              onClick={onClose}
              style={{ fontSize: '1.25rem', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1, padding: '4px 8px' }}
            >
              ✕
            </button>
          </div>

          {/* Emoji */}
          <div style={{ height: '11rem', background: '#f5f5f3', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', marginBottom: '1.25rem', border: '1px solid #f0f0ee' }}>
            {item.emoji}
          </div>

          {/* Meta */}
          <div style={{ marginBottom: '1rem' }}>
            {[
              { key: 'Category', val: item.category },
              { key: item.status === 'lost' ? 'Date lost' : 'Date found', val: item.dateLabel },
              { key: 'Status', val: item.status.charAt(0).toUpperCase() + item.status.slice(1) },
            ].map(({ key, val }) => (
              <div key={key} style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ color: '#6b6b6b', width: '5rem', flexShrink: 0 }}>{key}</span>
                <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <p style={{ fontSize: '0.875rem', color: '#6b6b6b', lineHeight: 1.6, background: '#fafafa', borderRadius: '0.5rem', padding: '0.75rem', border: '1px solid #f0f0ee', marginBottom: '1.25rem' }}>
            {item.description}
          </p>

          {/* Finder */}
          <div
            onClick={handleViewProfile}
            style={{ background: '#fafafa', borderRadius: '0.75rem', padding: '0.875rem', border: '1px solid #f0f0ee', marginBottom: '1rem', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 500, color: '#1d4ed8' }}>
                  {item.finder.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1a1a1a' }}>{item.finder.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>{item.finder.dept}</p>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 500 }}>View profile →</span>
            </div>
          </div>

          {/* Not responding note */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.75rem', color: '#92400e', lineHeight: 1.6 }}>
            <strong>Finder not responding?</strong> Click their profile above to find them in person using their class and department info.
          </div>

          {/* Actions */}
          {item.status === 'returned' ? (
            <div style={{ width: '100%', padding: '0.75rem', background: '#f5f5f3', color: '#6b6b6b', borderRadius: '0.75rem', fontSize: '0.875rem', textAlign: 'center' }}>
              This item has been returned ✓
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={handleWhatsApp}
                style={{ width: '100%', padding: '0.75rem', background: '#25d366', color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                Contact via WhatsApp
              </button>

              {isOwner && (
                <button
                  onClick={() => onMarkReturned(item.id)}
                  style={{ width: '100%', padding: '0.75rem', background: 'white', color: '#1a1a1a', border: '1px solid #d4d4d2', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}
                >
                  Mark as returned
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}