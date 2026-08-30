import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminStats, getRecentProducts, getAllCategories } from '@/lib/services/admin-service'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function AdminDashboardPage() {
  const [stats, recentProducts, categories] = await Promise.all([
    getAdminStats(),
    getRecentProducts(),
    getAllCategories(),
  ])

  const STATS_CARDS = [
    { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: 'bg-blue-50 text-blue-700', border: 'border-blue-100' },
    { label: 'In Stock', value: stats.inStock, icon: '✅', color: 'bg-green-50 text-green-700', border: 'border-green-100' },
    { label: 'Out of Stock', value: stats.outOfStock, icon: '⚠️', color: 'bg-amber-50 text-amber-700', border: 'border-amber-100' },
    { label: 'Categories', value: stats.totalCategories, icon: '🗂️', color: 'bg-purple-50 text-purple-700', border: 'border-purple-100' },
    { label: 'Genuine OEM', value: stats.oemCount, icon: '🏅', color: 'bg-sky-50 text-sky-700', border: 'border-sky-100' },
    { label: 'Aftermarket', value: stats.aftermarketCount, icon: '🔧', color: 'bg-orange-50 text-orange-700', border: 'border-orange-100' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-audi-anthracite rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Welcome back, Admin</h2>
          <p className="text-audi-titanium text-sm mt-1">
            Manage your Audi spare parts catalogue from here.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 h-10 px-5 bg-audi-red text-white font-semibold rounded-lg text-sm hover:bg-audi-red-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {STATS_CARDS.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white rounded-xl border p-4 ${stat.border}`}
          >
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-lg mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-audi-anthracite">{stat.value}</p>
            <p className="text-xs text-audi-steel mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent products */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-audi-fog">
          <div className="flex items-center justify-between px-5 py-4 border-b border-audi-fog">
            <h3 className="font-bold text-audi-anthracite">Recent Products</h3>
            <Link href="/admin/products" className="text-xs text-audi-red hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-audi-mist">
            {recentProducts.length === 0 ? (
              <p className="px-5 py-8 text-center text-audi-titanium text-sm">No products found.</p>
            ) : (
              recentProducts.map((part) => (
                <div key={part.sku} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-10 h-10 rounded-lg bg-audi-fog flex items-center justify-center overflow-hidden flex-shrink-0 border border-audi-fog">
                    {part.images && part.images.length > 0 ? (
                      <img 
                        src={part.images[0]} 
                        alt={part.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl opacity-40">📦</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-audi-anthracite truncate">{part.name}</p>
                    <p className="text-xs text-audi-titanium font-mono">{part.partNumber}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-audi-anthracite">${part.price.toFixed(2)}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      part.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {part.inStock ? `${part.stockCount} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  <Link
                    href={`/admin/products/${part.sku}/edit`}
                    className="ml-2 w-8 h-8 flex items-center justify-center rounded-lg text-audi-titanium hover:bg-audi-fog hover:text-audi-slate transition-colors flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl border border-audi-fog">
          <div className="px-5 py-4 border-b border-audi-fog">
            <h3 className="font-bold text-audi-anthracite">By Category</h3>
          </div>
          <div className="p-5 space-y-3">
            {categories.map((cat) => {
              // Note: For a real breakdown, we'd need a more complex query or aggregate data.
              // For now, we'll show just the categories.
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-audi-slate flex items-center gap-1.5">
                      {cat.icon} {cat.name}
                    </span>
                  </div>
                  <div className="h-1.5 bg-audi-fog rounded-full overflow-hidden">
                    <div
                      className="h-full bg-audi-red rounded-full transition-all"
                      style={{ width: `0%` }} // Placeholder as we don't have counts here
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Add New Product', desc: 'Upload a new spare part to the catalogue', href: '/admin/products/new', icon: '➕', color: 'text-audi-red' },
          { label: 'Manage Categories', desc: 'Edit part categories and organisation', href: '/admin/categories', icon: '🗂️', color: 'text-purple-600' },
          { label: 'Review Testimonials', desc: 'Approve or reject customer feedback', href: '/admin/testimonials', icon: '💬', color: 'text-green-600' },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="bg-white rounded-xl border border-audi-fog p-5 hover:border-audi-silver hover:shadow-sm transition-all group"
          >
            <span className="text-2xl">{action.icon}</span>
            <p className={`font-bold text-sm mt-3 mb-1 group-hover:${action.color} transition-colors`}>
              {action.label}
            </p>
            <p className="text-xs text-audi-titanium">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
