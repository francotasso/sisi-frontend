import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface WishlistItem {
  id: string
  addedAt: number
  quantity: number
}

interface WishlistState {
  items: WishlistItem[]
}

const initialState: WishlistState = {
  items: [],
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<string>) => {
      const exists = state.items.some(item => item.id === action.payload)
      if (!exists) {
        state.items.push({
          id: action.payload,
          addedAt: Date.now(),
          quantity: 1,
        })
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    clearWishlist: (state) => {
      state.items = []
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id)
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity)
      }
    },
  },
})

export const { addToWishlist, removeFromWishlist, clearWishlist, updateQuantity } = wishlistSlice.actions
export default wishlistSlice.reducer