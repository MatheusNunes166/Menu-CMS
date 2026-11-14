import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { SpotService } from "../services/spot.service"
import type { UpdateSpotDTO } from "../dtos/update-spot.dto"

export function useSpots() {
    return useQuery({
        queryKey: ["spots"],
        queryFn: () => SpotService.listAll(),
    })
}
export function useCreateSpot() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: SpotService.create,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["spots"],
            })
        },
    })
}
export function useUpdateSpot() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            dto,
        }: {
            id: string
            dto: UpdateSpotDTO
        }) => SpotService.update(id, dto),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["spots"],
            })
        },
    })
}