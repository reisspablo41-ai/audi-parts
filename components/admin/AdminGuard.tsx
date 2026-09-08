'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isAdminUser } from '@/lib/admin'

type State = 'checking' | 'ok' | 'denied'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [state, setState] = useState<State>('checking')

  useEffect(() => {
    async function checkAuth() {
      if (pathname === '/admin/login') {
        setState('ok')
        return
      }

      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/admin/login')
        return
      }

      // Signed in is not the same as authorised. Previously any authenticated
      // Supabase user reached the admin panel; now the id must be on the
      // allowlist. The API enforces this again server-side — this check is for
      // the visitor's benefit, not for security.
      if (!isAdminUser(session.user.id)) {
        setState('denied')
        return
      }

      setState('ok')
    }

    checkAuth()
  }, [pathname, router])

  if (state === 'checking') {
    return (
      <div className="min-h-screen bg-audi-anthracite flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-audi-red border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (state === 'denied') {
    return (
      <div className="min-h-screen bg-audi-anthracite flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="w-12 h-12 rounded-full bg-audi-red/15 border border-audi-red/30 flex items-center justify-center mx-auto mb-5">
            <svg className="w-5 h-5 text-audi-red" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.5m0 3.5h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-white mb-2">Not authorised</h1>
          <p className="text-sm text-audi-titanium leading-relaxed mb-6">
            This account is signed in but does not have admin access. Ask an existing
            administrator to add your user ID to the allowlist.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.replace('/admin/login')
            }}
            className="h-10 px-5 bg-audi-red text-white text-sm font-semibold rounded-md hover:bg-audi-red-dark transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
