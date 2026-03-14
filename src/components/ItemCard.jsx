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
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-[#e5e5e3] w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <h2 className="font-display text-xl font-semibold text-[#1a1a1a] leading-tight pr-4">
              {item.name}
            </h2>
            <button
              onClick={onClose}
              className="text-[#aaa] hover:text-[#1a1a1a] text-xl leading-none transition-colors flex-shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Emoji image */}
          <div className="h-44 bg-[#f5f5f3] rounded-xl flex items-center justify-center text-6xl mb-5 border border-[#f0f0ee]">
            {item.emoji}
          </div>

          {/* Meta rows */}
          <div className="space-y-2 mb-4">
            {[
              { key: 'Category', val: item.category },
              { key: item.status === 'lost' ? 'Date lost' : 'Date found', val: item.dateLabel },
              {
                key: 'Status',
                val: (
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusStyles[item.status]}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                ),
              },
            ].map(({ key, val }) => (
              <div key={key} className="flex gap-4 text-sm">
                <span className="text-[#6b6b6b] w-20 flex-shrink-0">{key}</span>
                <span className="text-[#1a1a1a] font-medium">{val}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-[#6b6b6b] leading-relaxed bg-[#fafafa] rounded-lg p-3 border border-[#f0f0ee] mb-5">
            {item.description}
          </p>

          {/* Finder info */}
          <div
            onClick={handleViewProfile}
            className="bg-[#fafafa] rounded-xl p-3.5 border border-[#f0f0ee] mb-4 cursor-pointer hover:border-[#aaa] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700 flex-shrink-0">
                  {item.finder.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">{item.finder.name}</p>
                  <p className="text-xs text-[#6b6b6b]">{item.finder.dept}</p>
                </div>
              </div>
              <span className="text-xs text-blue-600 font-medium">View profile →</span>
            </div>
          </div>

          {/* Not responding note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-700 leading-relaxed">
            <span className="font-medium">Finder not responding?</span> Click their profile above to find them in person using their class and department info.
          </div>

          {/* Actions */}
          {item.status === 'returned' ? (
            <div className="w-full py-3 bg-[#f5f5f3] text-[#6b6b6b] rounded-xl text-sm font-medium text-center">
              This item has been returned ✓
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleWhatsApp}
                className="w-full py-3 bg-[#25d366] text-white rounded-xl text-sm font-medium
                           hover:bg-[#1ebe5d] transition-colors flex items-center justify-center gap-2"
              >
                <WhatsAppIcon />
                Contact via WhatsApp
              </button>

              {isOwner && item.status !== 'returned' && (
                <button
                  onClick={() => onMarkReturned(item.id)}
                  className="w-full py-3 bg-white text-[#1a1a1a] border border-[#d4d4d2] rounded-xl
                             text-sm font-medium hover:bg-[#f5f5f3] transition-colors"
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

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.5 3.5A12 12 0 0 0 3.7 18.3L2 22l3.8-1.6A12 12 0 1 0 20.5 3.5zm-8.5 18a10 10 0 0 1-5.4-1.6l-.4-.2-2.4 1 1-2.3-.3-.4A10 10 0 1 1 12 21.5zm5.5-7.5c-.3-.1-1.8-.9-2.1-1s-.5-.1-.7.2-.8 1-1 1.2-.4.1-.7 0a8.3 8.3 0 0 1-2.4-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-.9-2.3c-.3-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.7 1.2 3.2 1.4 3.4 2.4 3.6 5.8 5c.8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.8-.7 2-1.4s.2-1.3.2-1.4-.2-.2-.5-.4z"
        fill="white"
      />
    </svg>
  )
}