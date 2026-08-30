import { getAllReviews } from '@/lib/services/admin-service'
import { deleteReview } from '@/app/actions/reviews'
import Link from 'next/link'

export const metadata = {
  title: 'Reviews Management',
}

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-audi-anthracite">Product Reviews</h1>
          <p className="text-sm text-audi-steel font-medium">Manage and moderate customer feedback across all products.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-audi-fog shadow-sm">
          <span className="text-sm font-bold text-audi-titanium uppercase tracking-widest mr-2">Total</span>
          <span className="text-lg font-bold text-audi-anthracite">{reviews.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-audi-fog overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-audi-mist border-b border-audi-fog">
                <th className="text-left px-6 py-4 text-xs font-bold text-audi-titanium uppercase tracking-widest">Product</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-audi-titanium uppercase tracking-widest">Rating</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-audi-titanium uppercase tracking-widest">Author</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-audi-titanium uppercase tracking-widest">Review</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-audi-titanium uppercase tracking-widest">Date</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-audi-titanium uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-audi-mist">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-audi-titanium">
                    <div className="w-16 h-16 bg-audi-mist rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-audi-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="font-bold">No reviews found</p>
                  </td>
                </tr>
              ) : (
                reviews.map((review: any) => (
                  <tr key={review.id} className="hover:bg-audi-mist/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <p className="font-bold text-audi-anthracite truncate max-w-[180px]">{review.parts?.name || 'Unknown Product'}</p>
                        <p className="text-xs font-mono text-audi-titanium">{review.sku}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg
                            key={s}
                            className={`w-3 h-3 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-audi-fog fill-audi-fog'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-audi-fog flex items-center justify-center text-xs font-bold text-audi-steel">
                          {review.author_name?.[0]?.toUpperCase()}
                        </div>
                        <p className="font-bold text-audi-slate">{review.author_name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-bold text-audi-anthracite truncate">{review.title}</p>
                        <p className="text-xs text-audi-steel line-clamp-1">{review.body}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs font-bold text-audi-titanium">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${review.sku}`}
                          target="_blank"
                          className="p-2 text-audi-titanium hover:text-audi-anthracite hover:bg-audi-fog rounded-lg transition-all"
                          title="View product"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                        <form action={async () => {
                          'use server'
                          await deleteReview(review.id, review.sku)
                        }}>
                          <button
                            type="submit"
                            className="p-2 text-audi-titanium hover:text-audi-red hover:bg-red-50 rounded-lg transition-all"
                            title="Delete review"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </form>
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
