import type { SpotDTO } from "@/cases/spots/dtos/spot.dto"

export interface GuestCheckDTO {
  id: string
  createdAt: string
  status: "OPENED" | "CLOSED"
  spot: SpotDTO
}