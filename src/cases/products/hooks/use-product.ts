import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ProductService } from "../services/product.service"

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