import { api } from "@/lib/axios"
import type { GuestCheckDTO } from "../dtos/guest-check.dto"

const ENDPOINT = "/guest-checks"

export const GuestCheckService = {
  async listOpened(): Promise<GuestCheckDTO[]> {
    const result = await api.get<GuestCheckDTO[]>(ENDPOINT)
    return result.data
  },

  async findOne(id: string): Promise<GuestCheckDTO> {
    const result = await api.get<GuestCheckDTO>(
      `${ENDPOINT}/${id}`,
    )

    return result.data
  },
}