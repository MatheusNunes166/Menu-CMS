import { api } from "@/lib/axios"
import type { OrderDTO } from "../dtos/order.dto"
import type { UpdateOrderStatusDTO } from "../dtos/update-order-status.dto"

const ENDPOINT = "/orders"

export const OrderService = {
  async listAll(): Promise<OrderDTO[]> {
    const result = await api.get<OrderDTO[]>(ENDPOINT)
    return result.data
  },

  async findOne(id: string): Promise<OrderDTO> {
    const result = await api.get<OrderDTO>(
      `${ENDPOINT}/${id}`,
    )

    return result.data
  },

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDTO,
  ): Promise<OrderDTO> {
    const result = await api.patch<OrderDTO>(
      `${ENDPOINT}/${id}/status`,
      dto,
    )

    return result.data
  },
}