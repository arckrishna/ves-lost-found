import { useNavigate } from 'react-router-dom'

export default function AccessDeniedPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col">
      <nav className="bg-white border-b border-[#e5e5e3] px-6 h-14 flex items-center">
        <span className="font-display text-lg text-[#1a1a1a]">
          VES <span className="text-blue-600">Found</span>
        </span>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white border border-[#e5e5e3] rounded-2xl p-10 w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-2xl mx-auto mb-5">
            🚫
          </div>

          <h1 className="font-display text-2xl font-semibold text-[#1a1a1a] mb-2">
            Access Denied
          </h1>
          <p className="text-sm text-[#6b6b6b] leading-relaxed mb-6">
            Only <span className="font-medium text-[#1a1a1a]">@ves.ac.in</span> email addresses
            are allowed to access this portal. Please sign in with your VES college account.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs text-red-700 leading-relaxed">
              <span className="font-medium">Why am I seeing this?</span> You tried to sign in
              with a non-VES email address. This portal is restricted to VES Institute of
              Technology students and staff only.
            </p>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}