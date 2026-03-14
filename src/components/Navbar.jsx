import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()

  const initials = profile?.fullName
    ? profile.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-[#e5e5e3] px-6 h-14 flex items-center justify-between sticky top-0 z-50">
      <div
        className="font-display text-lg text-[#1a1a1a] tracking-tight cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        VES <span className="text-blue-600">Found</span>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors hidden sm:block"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/my-items')}
            className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors hidden sm:block"
          >
            My Items
          </button>
          <div
            onClick={() => navigate(`/profile/${user.uid}`)}
            className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700 select-none cursor-pointer hover:bg-blue-200 transition-colors"
          >
            {initials}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium px-3 py-1.5 border border-[#d4d4d2] rounded-lg hover:bg-[#f5f5f3] transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  )
}