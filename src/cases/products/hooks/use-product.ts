import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ProductService } from "../services/product.service"
import type { UpdateProductDTO } from "../dtos/update-product.dto"

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => ProductService.listAll(),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ProductService.create,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string
      dto: UpdateProductDTO
    }) => ProductService.update(id, dto),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      })
    },
  })
}