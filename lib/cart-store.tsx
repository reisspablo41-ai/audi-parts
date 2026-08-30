'use client'

import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'

export interface CartItem {
  sku: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { sku: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART'; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  addItem: (item: CartItem) => void
  removeItem: (sku: string) => void
  updateQuantity: (sku: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  totalCount: number
  subtotal: number
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Last line of defence: an unpriced part must never reach the cart, no
      // matter which surface tried to add it.
      if (!(action.payload.price > 0)) {
        console.warn('[cart] refused unpriced item', action.payload.sku)
        return state
      }
      const existingItem = state.items.find((item) => item.sku === action.payload.sku)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.sku === action.payload.sku
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          isOpen: true,
        }
      }
      return { ...state, items: [...state.items, action.payload], isOpen: true }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.sku !== action.payload) }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.sku === action.payload.sku ? { ...item, quantity: action.payload.quantity } : item
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'SET_CART':
      return { ...state, items: action.payload }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('audi_cart')
    if (savedCart) {
      try {
        dispatch({ type: 'SET_CART', payload: JSON.parse(savedCart) })
      } catch (e) {
        console.error('Failed to parse cart', e)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('audi_cart', JSON.stringify(state.items))
  }, [state.items])

  const totalCount = state.items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item })
  const removeItem = (sku: string) => dispatch({ type: 'REMOVE_ITEM', payload: sku })
  const updateQuantity = (sku: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { sku, quantity } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' })

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        totalCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
