import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllCategories } from '@/lib/services/admin-service'

export const metadata: Metadata = { title: 'Categories' }

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-audi-anthracite">Manage Categories</h2>
          <p className="text-sm text-audi-steel mt-1">
            Organise your spare parts into logical groups.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 h-10 px-5 bg-audi-red text-white font-semibold rounded-lg text-sm hover:bg-audi-red-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-audi-fog overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-audi-mist border-b border-audi-fog">
                <th className="text-left px-6 py-4 text-xs font-semibold text-audi-steel uppercase tracking-wide w-[300px]">Category</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-audi-steel uppercase tracking-wide">Slug</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-audi-steel uppercase tracking-wide">Description</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-audi-steel uppercase tracking-wide">Total Parts</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-audi-steel uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-audi-mist">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-audi-titanium">
                    <span className="text-4xl block mb-2">📁</span>
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-audi-mist/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-audi-fog flex items-center justify-center text-xl">
                          {cat.icon}
                        </div>
                        <div>
                          <p className="font-bold text-audi-anthracite">{cat.name}</p>
                          <p className="text-[10px] text-audi-titanium uppercase tracking-wider mt-0.5">ID: {cat.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-[11px] bg-audi-fog text-audi-steel px-1.5 py-0.5 rounded font-mono">
                        {cat.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4 max-w-sm">
                      <p className="text-audi-steel text-xs line-clamp-1 truncate" title={cat.description}>
                        {cat.description || <span className="italic text-audi-silver">No description</span>}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        cat.partCount > 0 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'bg-audi-mist text-audi-titanium'
                      }`}>
                        {cat.partCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/categories/${cat.id}/edit`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-audi-titanium hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-audi-titanium hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
