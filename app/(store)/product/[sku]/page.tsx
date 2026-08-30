import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PartCard from '@/components/PartCard'
import FitmentChecker from '@/components/FitmentChecker'
import ProductImageGallery from '@/components/ProductImageGallery'
import { getStorePartBySku, getRelatedStoreParts, getReviewsForSku } from '@/lib/services/store-service'
import { getCategoryById } from '@/lib/services/admin-service'
import AddToCart from '@/components/AddToCart'
import ReviewForm from '@/components/ReviewForm'

interface ProductPageProps {
  params: Promise<{ sku: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { sku } = await params
  const part = await getStorePartBySku(sku)
  if (!part) return {}
  return {
    title: `${part.name} – ${part.partNumber}`,
    description: part.description.slice(0, 160),
  }
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-amber-500' : 'text-audi-fog'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-medium text-audi-slate">{rating.toFixed(1)}</span>
      <span className="text-sm text-audi-titanium">({count} reviews)</span>
    </div>
  )
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { sku } = await params
  
  const [part, reviews, relatedParts] = await Promise.all([
    getStorePartBySku(sku),
    getReviewsForSku(sku),
    getRelatedStoreParts(sku),
  ])

  if (!part) notFound()
  const category = await getCategoryById(part.categoryId)

  const discount = part.compareAtPrice
    ? Math.round(((part.compareAtPrice - part.price) / part.compareAtPrice) * 100)
    : 0

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-audi-mist border-b border-audi-fog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-audi-titanium">
            <Link href="/" className="hover:text-audi-slate">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-audi-slate">Shop</Link>
            <span>/</span>
            {category && (
              <>
                <Link href={`/category/${category.id}`} className="hover:text-audi-slate">
                  {category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-audi-slate font-medium truncate max-w-[200px]">{part.name}</span>
          </nav>
        </div>
      </div>

      {/* Product main section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <ProductImageGallery part={part} />

          {/* Right: Product Info */}
          <div>
            {/* Header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-audi-steel uppercase tracking-wide bg-audi-fog px-2 py-1 rounded">
                  {part.brand}
                </span>
                <span className="technical text-[11px] text-audi-titanium">{part.sku}</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-audi-anthracite leading-tight">{part.name}</h1>
              <div className="mt-3">
                <StarRating rating={part.rating} count={part.reviewCount} />
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-audi-fog">
              {part.price <= 0 ? (
                <span className="text-3xl font-semibold text-audi-slate">Price on request</span>
              ) : (
              <span className="text-4xl font-bold text-audi-anthracite technical">${part.price.toFixed(2)}</span>
              )}
              {part.compareAtPrice && (
                <span className="text-xl text-audi-titanium line-through">${part.compareAtPrice.toFixed(2)}</span>
              )}
              {discount > 0 && (
                <span className="text-sm font-bold text-audi-red">Save ${(part.compareAtPrice! - part.price).toFixed(2)}</span>
              )}
            </div>

            {/* Availability — omitted while a part is unpriced, since
                "Out of stock" alongside "Price on request" reads as broken. */}
            <div className={`flex items-center gap-2 mb-5 ${part.price <= 0 ? 'hidden' : ''}`}>
              <div
                className={`w-2.5 h-2.5 rounded-full ${part.inStock ? 'bg-audi-success' : 'bg-red-400'}`}
              />
              <span className={`text-sm font-medium ${part.inStock ? 'text-audi-success' : 'text-red-600'}`}>
                {part.inStock ? `In Stock – ${part.stockCount} units available` : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <p className="text-audi-steel text-sm leading-relaxed mb-6 whitespace-pre-line">{part.description}</p>

            {/* Add to Cart */}
            <AddToCart part={part} />

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-2 mb-6 p-4 bg-audi-mist rounded-lg border border-audi-fog">
              {[
                { text: 'Next-day dispatch', d: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1' },
                { text: '30-day returns', d: 'M3 10h10a5 5 0 010 10h-3M3 10l4-4M3 10l4 4' },
                { text: 'Secure checkout', d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
              ].map((item) => (
                <div key={item.text} className="text-center">
                  <svg className="w-5 h-5 mx-auto mb-2 text-audi-red" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.d} />
                  </svg>
                  <p className="text-[10px] uppercase font-semibold text-audi-steel tracking-wider leading-tight">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Fitment Checker */}
            <FitmentChecker part={part} />
          </div>
        </div>

        {/* Tech Specs */}
        <div className="mt-16 grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-audi-anthracite mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-audi-red rounded-full" />
              Technical specifications
            </h2>
            <div className="border border-audi-fog rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { label: 'Part Number', value: part.partNumber },
                    { label: 'SKU', value: part.sku },
                    { label: 'Brand', value: part.brand },
                    { label: 'Category', value: part.category },
                    ...(part.oemCrossReference ? [{ label: 'OEM Cross-Reference', value: part.oemCrossReference }] : []),
                    ...(part.weight ? [{ label: 'Weight', value: part.weight }] : []),
                    ...(part.material ? [{ label: 'Material', value: part.material }] : []),
                  ].map((row, i) => (
                    <tr
                      key={row.label}
                      className={i % 2 === 0 ? 'bg-audi-mist/50' : 'bg-white'}
                    >
                      <td className="px-4 py-3.5 font-bold text-audi-steel w-2/5 border-r border-audi-fog">{row.label}</td>
                      <td className="px-4 py-3.5 text-audi-anthracite font-medium">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shipping & Returns info */}
          <div>
            <h2 className="text-xl font-bold text-audi-anthracite mb-5 flex items-center gap-2">
               <span className="w-1 h-5 bg-audi-titanium rounded-full" />
               Shipping &amp; returns
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  title: 'Standard shipping',
                  body: '3–5 business days. Free on orders over $150.',
                  d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
                },
                {
                  title: 'Express delivery',
                  body: 'Order before 2 PM for next business day delivery.',
                  d: 'M13 10V3L4 14h7v7l9-11h-7z',
                },
                {
                  title: 'Easy returns',
                  body: 'Return unused parts within 30 days for a full refund.',
                  d: 'M3 10h10a5 5 0 010 10h-3M3 10l4-4M3 10l4 4',
                },
                {
                  title: 'International',
                  body: 'We ship worldwide. Duties may apply at destination.',
                  d: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0zM3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18a15 15 0 010-18z',
                },
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-lg border border-audi-fog bg-audi-mist/50">
                  <svg className="w-5 h-5 mb-3 text-audi-steel" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.d} />
                  </svg>
                  <p className="font-semibold text-sm text-audi-anthracite mb-1">{item.title}</p>
                  <p className="text-xs text-audi-steel leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div id="reviews" className="mt-16 bg-audi-mist rounded-lg p-8 border border-audi-fog">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-audi-anthracite mb-2">Customer reviews</h2>
              <p className="text-sm text-audi-steel font-medium">Verified feedback from Audi owners and independent workshops.</p>
            </div>
            <ReviewForm sku={part.sku} productName={part.name} />
          </div>

          {reviews.length > 0 ? (
            <>
              <div className="flex flex-col md:flex-row gap-8 mb-12 items-start md:items-center border-b border-audi-fog pb-12">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-audi-fog text-center min-w-[200px]">
                  <p className="text-6xl font-bold text-audi-anthracite mb-2 tracking-tight technical">{part.rating.toFixed(1)}</p>
                  <div className="flex justify-center mb-3">
                     <StarRating rating={part.rating} count={part.reviewCount} />
                  </div>
                  <p className="text-[10px] text-audi-titanium font-bold uppercase tracking-[0.2em]">{part.reviewCount} reviews</p>
                </div>
                <div className="flex-1 space-y-3 max-w-sm">
                   {[5,4,3,2,1].map(num => {
                     const count = reviews.filter((r: any) => r.rating === num).length;
                     const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                     return (
                       <div key={num} className="flex items-center gap-4">
                         <span className="text-xs font-bold text-audi-titanium w-3">{num}</span>
                         <div className="flex-1 h-2.5 bg-audi-fog rounded-full overflow-hidden">
                           <div 
                            className="h-full bg-amber-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${percentage}%` }}
                           />
                         </div>
                         <span className="text-xs font-bold text-audi-titanium w-8">{percentage}%</span>
                       </div>
                     );
                   })}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {reviews.map((review: any) => (
                  <div key={review.id} className="bg-white rounded-lg p-8 shadow-sm border border-audi-fog flex flex-col group hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-audi-fog flex items-center justify-center text-audi-anthracite font-bold text-lg border-2 border-white shadow-sm">
                          {review.author_name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div>
                          <p className="font-bold text-audi-anthracite">{review.author_name}</p>
                          <p className="text-[10px] text-audi-titanium font-bold uppercase tracking-widest mt-0.5">
                            {new Date(review.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      {review.is_verified && (
                         <span className="text-[9px] bg-audi-success-soft text-audi-success border border-audi-success/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg
                          key={s}
                          className={`w-4 h-4 ${s <= review.rating ? 'text-amber-500 fill-amber-400' : 'text-audi-fog fill-audi-fog'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <h4 className="text-lg font-bold text-audi-anthracite mb-3 leading-tight">{review.title}</h4>
                    <p className="text-audi-steel leading-relaxed flex-1">{review.body}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg p-12 text-center border-2 border-dashed border-audi-fog">
              <div className="w-20 h-20 bg-audi-mist rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-audi-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-audi-anthracite mb-2">No reviews yet</h3>
              <p className="text-audi-steel max-w-xs mx-auto mb-8 font-medium">Be the first to share how this part fitted, and help the next Audi owner.</p>
            </div>
          )}
        </div>

        {/* Often replaced together */}
        {relatedParts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-audi-anthracite mb-2 flex items-center gap-2">
              <span className="w-1 h-6 bg-audi-red rounded-full" />
              Often replaced together
            </h2>
            <p className="text-sm text-audi-steel mb-8 ml-3.5">
              Customers who bought this part also replaced these components at the same time.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedParts.map((related) => (
                <PartCard key={related.sku} part={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
