import type { Metadata } from 'next'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminGuard from '@/components/admin/AdminGuard'

export const metadata: Metadata = {
  title: { template: '%s | Admin – AudiParts Direct', default: 'Admin – AudiParts Direct' },
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-audi-fog">
        <div className="hidden lg:flex">
          <AdminSidebar />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <AdminHeader />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </AdminGuard>
  )
}
