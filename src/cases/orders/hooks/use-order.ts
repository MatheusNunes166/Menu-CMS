import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { OrderService } from "../services/order.service"
import type { UpdateOrderStatusDTO } from "../dtos/update-order-status.dto"

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => OrderService.listAll(),
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string
      dto: UpdateOrderStatusDTO
    }) => OrderService.updateStatus(id, dto),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["orders"],
      })
    },
  })
}