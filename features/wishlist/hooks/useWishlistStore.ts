'use client'

import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { RootState } from '@/shared/store'
import { addToWishlist, removeFromWishlist, clearWishlist, updateQuantity } from '@/shared/store/wishlistSlice'
import { useCallback } from 'react'

export function useWishlistStore() {
  const dispatch = useDispatch()
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items, shallowEqual)

  const addToWishlistDispatch = useCallback(
    (productId: string) => {
      dispatch(addToWishlist(productId))
    },
    [dispatch]
  )

  const removeFromWishlistDispatch = useCallback(
    (productId: string) => {
      dispatch(removeFromWishlist(productId))
    },
    [dispatch]
  )

  const clearWishlistDispatch = useCallback(() => {
    dispatch(clearWishlist())
  }, [dispatch])

  const updateQuantityDispatch = useCallback(
    (productId: string, quantity: number) => {
      dispatch(updateQuantity({ id: productId, quantity }))
    },
    [dispatch]
  )

  const isInWishlist = useCallback(
    (productId: string): boolean => {
      return wishlistItems.some(item => item.id === productId)
    },
    [wishlistItems]
  )

  const getItemQuantity = useCallback(
    (productId: string): number => {
      const item = wishlistItems.find(item => item.id === productId)
      return item?.quantity || 1
    },
    [wishlistItems]
  )

  return {
    items: wishlistItems,
    addToWishlist: addToWishlistDispatch,
    removeFromWishlist: removeFromWishlistDispatch,
    clearWishlist: clearWishlistDispatch,
    updateQuantity: updateQuantityDispatch,
    isInWishlist,
    getItemQuantity,
    count: wishlistItems.reduce((sum, item) => sum + item.quantity, 0),
  }
}