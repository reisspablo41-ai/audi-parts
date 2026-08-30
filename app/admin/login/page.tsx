'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { RingsMark } from '@/components/BrandMark'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-audi-anthracite flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <RingsMark className="h-5 w-auto text-white" />
            <div>
              <p className="text-white font-bold text-lg leading-tight">AudiParts</p>
              <p className="text-audi-steel text-[11px] uppercase tracking-widest">Admin Portal</p>
            </div>
          </div>
        </div>

        <div className="bg-audi-anthracite border border-audi-graphite rounded-lg p-8">
          <h1 className="text-xl font-bold text-white mb-1">Sign in</h1>
          <p className="text-sm text-audi-titanium mb-6">Access the AudiParts admin panel.</p>

          {/* Demo hint */}
          <div className="bg-audi-graphite border border-audi-slate rounded-lg p-3 mb-5">
            <p className="text-xs text-audi-silver font-semibold mb-0.5">Demo credentials</p>
            <p className="technical text-xs text-audi-red">admin@audiparts.com / admin1234</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-audi-titanium mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@audiparts.com"
                className="w-full h-11 px-4 bg-audi-graphite border border-audi-slate rounded-lg text-white text-sm placeholder-audi-steel focus:outline-none focus:border-audi-red transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-audi-titanium mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-4 bg-audi-graphite border border-audi-slate rounded-lg text-white text-sm placeholder-audi-steel focus:outline-none focus:border-audi-red transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-950 border border-red-800 rounded-lg px-4 py-2.5">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-audi-red text-white font-bold rounded-lg hover:bg-audi-red-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-audi-steel mt-6">
          Access is restricted to authorized administrator accounts.
        </p>
      </div>
    </div>
  )
}
