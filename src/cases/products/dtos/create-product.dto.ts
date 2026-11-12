export interface CreateProductDTO {
  name: string
  price: number
  description?: string
  picture?: string
  categoryId?: string
  active?: boolean
  isVegetarian?: boolean
  isNew?: boolean   
}