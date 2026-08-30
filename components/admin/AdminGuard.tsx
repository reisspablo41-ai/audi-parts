'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      if (pathname === '/admin/login') {
        setReady(true)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/admin/login')
      } else {
        setReady(true)
      }
    }

    checkAuth()
  }, [pathname, router])

  if (!ready) {
    return (
      <div className="min-h-screen bg-audi-anthracite flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-audi-red border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
