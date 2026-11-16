import type { GuestCheckDTO } from "@/cases/guest-check/dtos/guest-check.dto"
import type { OrderItemDTO } from "./order-item.dto"

export type OrderStatus =
  | "NEW"
  | "PREPARING"
  | "READY"
  | "DELIVERY"

export interface OrderDTO {
  id: string
  createdAt: string
  guestCheck: GuestCheckDTO
  total: number | string
  status: OrderStatus
  items: OrderItemDTO[]
}