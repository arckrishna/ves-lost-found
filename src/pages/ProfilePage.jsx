import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MOCK_ITEMS } from '../data/mockItems'
import Navbar from '../components/Navbar'

// Mock profiles for demo
const MOCK_PROFILES = {
  uid_demo_1: { fullName: 'Rohit Sharma', department: 'Computer Engineering', classDivision: 'TE-A', graduationYear: '2026', vesEmail: 'rohit.sharma@ves.ac.in', phone: '9876543210' },
  uid_demo_2: { fullName: 'Meena Patil', department: 'Information Technology', classDivision: 'SE-B', graduationYear: '2027', vesEmail: 'meena.patil@ves.ac.in', phone: '9823456789' },
  uid_demo_3: { fullName: 'Aakash Verma', department: 'Information Technology', classDivision: 'TE-A', graduationYear: '2026', vesEmail: 'aakash.verma@ves.ac.in', phone: '9811223344' },
  uid_demo_4: { fullName: 'Priya Nair', department: 'Computer Engineering', classDivision: 'BE-C', graduationYear: '2025', vesEmail: 'priya.nair@ves.ac.in', phone: '9799887766' },
  uid_demo_5: { fullName: 'Sanjay Gupta', department: 'Mechanical Engineering', classDivision: 'TE-A', graduationYear: '2026', vesEmail: 'sanjay.gupta@ves.ac.in', phone: '9766554433' },
  uid_demo_6: { fullName: 'Divya Kulkarni', department: 'Electronics & TC', classDivision: 'SE-B', graduationYear: '2027', vesEmail: 'divya.kulkarni@ves.ac.in', phone: '9755443322' },
  uid_demo_7: { fullName: 'Karan Mehta', department: 'Information Technology', classDivision: 'BE-A', graduationYear: '2025', vesEmail: 'karan.mehta@ves.ac.in', phone: '9744332211' },
  uid_demo_8: { fullName: 'Sneha Joshi', department: 'Civil Engineering', classDivision: 'TE-B', graduationYear: '2026', vesEmail: 'sneha.joshi@ves.ac.in', phone: '9733221100' },
}

export default function ProfilePage() {
  const { uid } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const profile = MOCK_PROFILES[uid]
  const userItems = MOCK_ITEMS.filter((item) => item.postedBy === uid)

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-3">👤</div>
            <p className="text-sm text-[#6b6b6b]">Profile not found.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 text-sm text-blue-600 underline"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const initials = profile.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi ${profile.fullName}! I found your contact on the VES Lost & Found portal.`
    )
    window.open(`https://wa.me/91${profile.phone}?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mb-6"
        >
          ← Back
        </button>

        {/* Profile card */}
        <div className="bg-white border border-[#e5e5e3] rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-medium text-blue-700">
              {initials}
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold text-[#1a1a1a]">
                {profile.fullName}
              </h1>
              <p className="text-sm text-[#6b6b6b]">{profile.department}</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 border-t border-[#f0f0ee] pt-5">
            {[
              { key: 'VES Email', val: profile.vesEmail },
              { key: 'Department', val: profile.department },
              { key: 'Class / Division', val: profile.classDivision },
              { key: 'Graduation Year', val: profile.graduationYear },
            ].map(({ key, val }) => (
              <div key={key} className="flex gap-4 text-sm">
                <span className="text-[#6b6b6b] w-32 flex-shrink-0">{key}</span>
                <span className="text-[#1a1a1a] font-medium">{val}</span>
              </div>
            ))}
          </div>

          {/* Contact button */}
          <div className="mt-6 space-y-2">
            <button
              onClick={handleWhatsApp}
              className="w-full py-3 bg-[#25d366] text-white rounded-xl text-sm font-medium
                         hover:bg-[#1ebe5d] transition-colors flex items-center justify-center gap-2"
            >
              <WhatsAppIcon />
              Contact via WhatsApp
            </button>

            <div className="bg-[#fafafa] border border-[#f0f0ee] rounded-xl p-3.5 text-xs text-[#6b6b6b] leading-relaxed">
              <span className="font-medium text-[#1a1a1a]">Finder not responding?</span> You can find{' '}
              {profile.fullName.split(' ')[0]} in person at{' '}
              <span className="font-medium text-[#1a1a1a]">{profile.classDivision}</span> —{' '}
              {profile.department}, batch of {profile.graduationYear}.
            </div>
          </div>
        </div>

        {/* User's posted items */}
        {userItems.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-[#6b6b6b] uppercase tracking-widest mb-3">
              Items posted by {profile.fullName.split(' ')[0]}
            </h2>
            <div className="space-y-2">
              {userItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate('/dashboard')}
                  className="bg-white border border-[#e5e5e3] rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-[#aaa] transition-colors"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1a1a1a]">{item.name}</p>
                    <p className="text-xs text-[#6b6b6b]">{item.category} · {item.dateLabel}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full
                    ${item.status === 'lost' ? 'bg-red-50 text-red-700 border border-red-200' : ''}
                    ${item.status === 'found' ? 'bg-green-50 text-green-700 border border-green-200' : ''}
                    ${item.status === 'returned' ? 'bg-[#f5f5f3] text-[#6b6b6b] border border-[#d4d4d2]' : ''}
                  `}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
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