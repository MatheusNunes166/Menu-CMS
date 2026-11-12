import type { CategoryDTO } from "@/cases/categories/dtos/category.dto"

export interface ProductDTO {
  id: string
  name: string
  description: string | null
  price: number | string
  picture: string | null
  active: boolean
  isVegetarian: boolean
  isNew: boolean
  category: CategoryDTO | null
}