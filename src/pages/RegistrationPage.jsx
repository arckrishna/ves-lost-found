import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { db } from '../lib/firebase'
import { DEPARTMENTS, GRAD_YEARS } from '../data/mockItems'
import Navbar from '../components/Navbar'

const INITIAL = {
  fullName: '',
  phone: '',
  alternateEmail: '',
  department: '',
  graduationYear: '',
  classDivision: '',
  rollNumber: '',
}

export default function RegistrationPage() {
  const { user, setProfile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number'
    if (!form.department) e.department = 'Required'
    if (!form.graduationYear) e.graduationYear = 'Required'
    if (!form.classDivision.trim()) e.classDivision = 'Required'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      const profileData = {
        ...form,
        vesEmail: user.email,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      }
      await setDoc(doc(db, 'users', user.uid), profileData)
      setProfile(profileData)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      alert('Failed to save profile. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, required, error, children }) => (
    <div>
      <label className="block text-xs font-medium text-[#4b4b4b] mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="bg-white border border-[#e5e5e3] rounded-2xl p-8 w-full max-w-xl">
          <div className="flex items-center gap-2 text-xs text-[#6b6b6b] mb-5">
            <div className="w-5 h-5 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[10px] text-white font-medium">
              1
            </div>
            Complete your profile to continue
          </div>

          <h2 className="font-display text-2xl font-semibold text-[#1a1a1a] mb-1">
            Create your account
          </h2>
          <p className="text-sm text-[#6b6b6b] mb-7 leading-relaxed">
            This information helps identify you and enables other students to reach you in person if needed.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Full name" required error={errors.fullName}>
                <input
                  className={`input-base ${errors.fullName ? 'border-red-400' : ''}`}
                  type="text"
                  placeholder="As per college records"
                  value={form.fullName}
                  onChange={(e) => set('fullName', e.target.value)}
                />
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="VES email">
                <input
                  className="input-base bg-[#fafafa] text-[#6b6b6b]"
                  type="email"
                  value={user?.email ?? ''}
                  readOnly
                />
              </Field>
            </div>

            <Field label="Phone number" required error={errors.phone}>
              <input
                className={`input-base ${errors.phone ? 'border-red-400' : ''}`}
                type="tel"
                placeholder="10-digit mobile"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </Field>

            <Field label="Alternate email">
              <input
                className="input-base"
                type="email"
                placeholder="Personal email"
                value={form.alternateEmail}
                onChange={(e) => set('alternateEmail', e.target.value)}
              />
            </Field>

            <Field label="Department" required error={errors.department}>
              <select
                className={`input-base ${errors.department ? 'border-red-400' : ''}`}
                value={form.department}
                onChange={(e) => set('department', e.target.value)}
              >
                <option value="" disabled>Select department</option>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </Field>

            <Field label="Graduation year" required error={errors.graduationYear}>
              <select
                className={`input-base ${errors.graduationYear ? 'border-red-400' : ''}`}
                value={form.graduationYear}
                onChange={(e) => set('graduationYear', e.target.value)}
              >
                <option value="" disabled>Select year</option>
                {GRAD_YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </Field>

            <Field label="Class / Division" required error={errors.classDivision}>
              <input
                className={`input-base ${errors.classDivision ? 'border-red-400' : ''}`}
                type="text"
                placeholder="e.g. TE-A"
                value={form.classDivision}
                onChange={(e) => set('classDivision', e.target.value)}
              />
            </Field>

            <Field label="Roll number">
              <input
                className="input-base"
                type="text"
                placeholder="e.g. 2021CE001"
                value={form.rollNumber}
                onChange={(e) => set('rollNumber', e.target.value)}
              />
            </Field>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account →'}
          </button>
        </div>
      </div>
    </div>
  )
}