import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_ITEMS } from '../data/mockItems'
import Navbar from '../components/Navbar'
import ItemDetailModal from '../components/ItemDetailModal'
import ReportModal from '../components/ReportModal'

export default function MyItemsPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState(MOCK_ITEMS)
  const [selectedItem, setSelectedItem] = useState(null)
  const [reportType, setReportType] = useState(null)
  const [activeTab, setActiveTab] = useState('all')

  const myItems = items.filter((item) => item.postedBy === user?.uid)

  const filtered = myItems.filter((item) => {
    if (activeTab === 'lost') return item.status === 'lost'
    if (activeTab === 'found') return item.status === 'found'
    if (activeTab === 'returned') return item.status === 'returned'
    return true
  })

  const handleMarkReturned = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'returned' } : item))
    )
    setSelectedItem(null)
  }

  const handleSubmitReport = async (formData) => {
    const dateLabel = new Date(formData.date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short',
    })
    const newItem = {
      id: String(Date.now()),
      name: formData.name,
      category: formData.category,
      emoji: categoryEmoji(formData.category),
      date: formData.date,
      dateLabel,
      status: formData.type,
      description: formData.description,
      finder: {
        name: profile?.fullName ?? 'You',
        dept: `${profile?.classDivision ?? ''} ${profile?.department ?? ''}`.trim(),
        phone: profile?.phone ?? '',
      },
      postedBy: user?.uid ?? 'me',
    }
    setItems((prev) => [newItem, ...prev])
  }

  const stats = {
    all: myItems.length,
    lost: myItems.filter((i) => i.status === 'lost').length,
    found: myItems.filter((i) => i.status === 'found').length,
    returned: myItems.filter((i) => i.status === 'returned').length,
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mb-6"
        >
          ← Back to dashboard
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-semibold text-[#1a1a1a]">
              My Items
            </h1>
            <p className="text-sm text-[#6b6b6b] mt-0.5">
              Items you have reported
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setReportType('lost')}
              className="px-4 py-2 text-sm font-medium rounded-lg border cursor-pointer transition-colors
                         bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            >
              + Report Lost
            </button>
            <button
              onClick={() => setReportType('found')}
              className="px-4 py-2 text-sm font-medium rounded-lg border cursor-pointer transition-colors
                         bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              + Report Found
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { key: 'all', label: 'Total', val: stats.all },
            { key: 'lost', label: 'Lost', val: stats.lost },
            { key: 'found', label: 'Found', val: stats.found },
            { key: 'returned', label: 'Returned', val: stats.returned },
          ].map(({ key, label, val }) => (
            <div
              key={key}
              onClick={() => setActiveTab(key)}
              className={`rounded-xl px-4 py-3.5 cursor-pointer transition-colors
                ${activeTab === key
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-[#f5f5f3] hover:bg-[#efefed]'
                }`}
            >
              <p className={`text-[11px] uppercase tracking-widest mb-0.5
                ${activeTab === key ? 'text-[#aaa]' : 'text-[#6b6b6b]'}`}>
                {label}
              </p>
              <p className={`text-2xl font-medium
                ${activeTab === key ? 'text-white' : 'text-[#1a1a1a]'}`}>
                {val}
              </p>
            </div>
          ))}
        </div>

        {/* Items list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#aaa]">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm">You haven't posted any items yet.</p>
            <div className="flex gap-2 justify-center mt-4">
              <button
                onClick={() => setReportType('lost')}
                className="px-4 py-2 text-sm font-medium rounded-lg border
                           bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              >
                Report Lost Item
              </button>
              <button
                onClick={() => setReportType('found')}
                className="px-4 py-2 text-sm font-medium rounded-lg border
                           bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                Report Found Item
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white border border-[#e5e5e3] rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#aaa] transition-colors"
              >
                <div className="w-12 h-12 bg-[#f5f5f3] rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-[#1a1a1a]">{item.name}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0
                      ${item.status === 'lost' ? 'bg-red-50 text-red-700 border border-red-200' : ''}
                      ${item.status === 'found' ? 'bg-green-50 text-green-700 border border-green-200' : ''}
                      ${item.status === 'returned' ? 'bg-[#f5f5f3] text-[#6b6b6b] border border-[#d4d4d2]' : ''}
                    `}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-[#6b6b6b] truncate">{item.description}</p>
                  <p className="text-[11px] text-[#aaa] mt-0.5">{item.category} · {item.dateLabel}</p>
                </div>
                {item.status !== 'returned' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMarkReturned(item.id)
                    }}
                    className="flex-shrink-0 px-3 py-1.5 text-xs font-medium border border-[#d4d4d2]
                               rounded-lg hover:bg-[#f5f5f3] transition-colors text-[#1a1a1a]"
                  >
                    Mark returned
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onMarkReturned={handleMarkReturned}
        />
      )}

      {reportType && (
        <ReportModal
          type={reportType}
          onClose={() => setReportType(null)}
          onSubmit={handleSubmitReport}
        />
      )}
    </div>
  )
}

function categoryEmoji(cat) {
  const map = {
    Electronics: '📱',
    'Books & Notes': '📓',
    'ID / Cards': '🪪',
    Clothing: '🧥',
    Accessories: '👜',
    Keys: '🔑',
    Other: '📦',
  }
  return map[cat] ?? '📦'
}