import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "../services/category.service";
import type { UpdateCategoryDto } from "../dtos/update-category.dto";

export function useCategories(){
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => CategoryService.listAll()
    })
}

    export function useCreateCategory(){
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: CategoryService.create,
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: ['categories'],
                })
            },
        })
    }
    export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string
      dto: UpdateCategoryDto
    }) => CategoryService.update(id, dto),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      })
    },
  })
}
 export function useDeleteCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: CategoryService.delete,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['categories'],
            })
        },
    })
}