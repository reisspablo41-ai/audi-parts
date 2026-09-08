import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CurrencyProvider } from '@/lib/currency-store'
import { getRequestCurrency } from '@/lib/currency-server'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const currency = await getRequestCurrency()

  return (
    <CurrencyProvider code={currency}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </CurrencyProvider>
  )
}
