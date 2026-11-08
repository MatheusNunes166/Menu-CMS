/* eslint-disable @typescript-eslint/no-unused-vars */
import { api } from "@/lib/axios";
import type { CategoryDTO } from "../dtos/category.dto";
import type { UpdateCategoryDto } from "../dtos/update-category.dto";

const ENDPOINT = '/categories';

export const CategoryService = {
    async listAll(): Promise<CategoryDTO[]> {
        const result = await api.get<CategoryDTO[]>(ENDPOINT);
        return result.data; 
    },
    async findOne(id:string): Promise<CategoryDTO> {
        const result = await api.get<CategoryDTO>(`${ENDPOINT}/${id}`);
        return result.data;
    },
    async create(data: {name:string}): Promise<CategoryDTO> {
        const result = await api.post<CategoryDTO>(ENDPOINT, data);
        return result.data;
    },
    async update(id:string, dto: UpdateCategoryDto,): Promise<CategoryDTO> {
        const result = await api.patch<CategoryDTO>(`${ENDPOINT}/${id}`, dto);
        return result.data;
    },
    async delete(id:string): Promise<void> {
        await api.delete(`${ENDPOINT}/${id}`);
    },
}