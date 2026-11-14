import { api } from "@/lib/axios"
import type { SpotDTO } from "../dtos/spot.dto"
import type { CreateSpotDTO } from "../dtos/create-spot.dto"
import type { UpdateSpotDTO } from "../dtos/update-spot.dto"

const ENDPOINT = "/spots"

export const SpotService = {
  async listAll(): Promise<SpotDTO[]> {
    const result = await api.get<SpotDTO[]>(ENDPOINT)
    return result.data
  },

  async findOne(id: string): Promise<SpotDTO> {
    const result = await api.get<SpotDTO>(
      `${ENDPOINT}/${id}`,
    )

    return result.data
  },
  async create(dto: CreateSpotDTO): Promise<SpotDTO> {
    const result = await api.post<SpotDTO>(ENDPOINT, dto)
    return result.data
  },
  async update(
    id: string,
    dto: UpdateSpotDTO,
  ): Promise<SpotDTO> {
    const result = await api.patch<SpotDTO>(
      `${ENDPOINT}/${id}`,
      dto,
    )

    return result.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`)
  },
}