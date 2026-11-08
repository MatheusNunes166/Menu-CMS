import { useCategories } from "../hooks/use-category"
import { Button } from "@/components/ui/button"
import {CategoryEditDialog} from "./category-edit-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { CategoryDeleteDialog } from "./category-delete-dialog"

export function CategoryList() {
  const [success, setSuccess] = useState("")

  const {
    data: categories = [],
    isPending,
    isError,
    refetch,
  } = useCategories()

  if (isPending) {
    return <p role="status">Carregando categorias...</p>
  }

  if (isError) {
    return (
      <div role="alert">
        <p className="mb-3 text-destructive">
          Não foi possível carregar as categorias.
        </p>

        <Button
          variant="outline"
          onClick={() => void refetch()}
        >
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {success && (
        <p role="status" className="text-sm text-green-500">
          {success}
        </p>
      )}

      {categories.length === 0 ? (
        <p>Nenhuma categoria cadastrada.</p>
      ) : (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Ícone</TableHead>
          <TableHead>Ordem de exibição</TableHead>
          <TableHead>Situação</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>{category.name}</TableCell>
            <TableCell>{category.icon || "-"}</TableCell>
            <TableCell>{category.displayOrder}</TableCell>

            <TableCell>
              {category.active ? "Ativa" : "Inativa"}
            </TableCell>

            <TableCell>
              <div className="flex items-start gap-2">
              <CategoryEditDialog category={category} />

              <CategoryDeleteDialog
                category={category}
                onDeleted={() => 
                  setSuccess("categoria excluída com sucesso")
                }
              />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )}
  </div>
  )
}