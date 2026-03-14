import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const MOCK_USER = {
  uid: 'uid_demo_1',
  email: 'student@ves.ac.in',
}

const MOCK_PROFILE = {
  fullName: 'Rohit Sharma',
  department: 'Computer Engineering',
  classDivision: 'TE-A',
  graduationYear: '2026',
  vesEmail: 'rohit.sharma@ves.ac.in',
  phone: '9876543210',
}

export function AuthProvider({ children }) {
  const [user] = useState(MOCK_USER)
  const [profile] = useState(MOCK_PROFILE)

  const loginWithGoogle = async () => MOCK_USER
  const logout = async () => {}

  return (
    <AuthContext.Provider value={{ user, profile, setProfile: () => {}, loading: false, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
