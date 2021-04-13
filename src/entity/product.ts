export interface Product {
  userId?: string,
  id?: string,
  name: string,
  description: string,
  price: number,
  publishedAt?: Date,
  active?: boolean
}

export interface EditableProduct extends Product{
  isPublished?: boolean
}

export interface ImageProduct{
  productId: string,
  id: string,
  name: string,
  active?: boolean
}