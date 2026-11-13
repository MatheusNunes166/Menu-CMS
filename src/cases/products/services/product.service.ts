import { api } from "@/lib/axios"
import type { ProductDTO } from "../dtos/product.dto"
import type { CreateProductDTO } from "../dtos/create-product.dto"
import type { UpdateProductDTO } from "../dtos/update-product.dto"

const ENDPOINT = "/products"

export const ProductService = {
  async listAll(): Promise<ProductDTO[]> {
    const result = await api.get<ProductDTO[]>(ENDPOINT)
    return result.data
  },

  async findOne(id: string): Promise<ProductDTO> {
    const result = await api.get<ProductDTO>(
      `${ENDPOINT}/${id}`,
    )
    

    return result.data
  },
  async create(dto: CreateProductDTO): Promise<ProductDTO> {
    const result = await api.post<ProductDTO>(ENDPOINT, dto)
        return result.data
},
    async update(
        id: string,
        dto: UpdateProductDTO,
        )  : Promise<ProductDTO> {
        const result = await api.patch<ProductDTO>(
        `${ENDPOINT}/${id}`,
        dto,
  )

  return result.data
},
}