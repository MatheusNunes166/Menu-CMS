export interface UpdateProductDTO {
  name?: string
  description?: string
  price?: number
  picture?: string | null
  categoryId?: string | null
  active?: boolean
  isVegetarian?: boolean
  isNew?: boolean
}