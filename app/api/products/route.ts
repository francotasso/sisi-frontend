import { NextResponse } from 'next/server'
import { catalogService } from '@/features/catalog/services/catalogService'

export async function GET() {
  const products = await catalogService.getProducts()
  return NextResponse.json(products)
}