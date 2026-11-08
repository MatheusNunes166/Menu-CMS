import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "../services/category.service";

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