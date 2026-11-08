import { useState } from "react"
import type { CategoryDTO } from "../dtos/category.dto"
import { useDeleteCategory } from "../hooks/use-category"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface CategoryDeleteDialogProps {
  category: CategoryDTO
  onDeleted: () => void
}

export function CategoryDeleteDialog({
  category,
  onDeleted,
}: CategoryDeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const deleteCategory = useDeleteCategory()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteCategory.isPending) return

    setOpen(nextOpen)

    if (nextOpen) {
      deleteCategory.reset()
    }
  }

  async function handleDelete() {
    try {
      await deleteCategory.mutateAsync(category.id)
      setOpen(false)
      onDeleted()
    } catch {
      // O erro será exibido usando deleteCategory.isError.
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="destructive" />}>
        Excluir
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir categoria?</DialogTitle>

          <DialogDescription>
            Deseja excluir a categoria “{category.name}”?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        {deleteCategory.isError && (
          <p role="alert" className="text-sm text-destructive">
            Não foi possível excluir a categoria. Confira se ela
            está vinculada a produtos e verifique o erro na API.
          </p>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            disabled={deleteCategory.isPending}
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button
            variant="destructive"
            disabled={deleteCategory.isPending}
            onClick={handleDelete}
          >
            {deleteCategory.isPending
              ? "Excluindo..."
              : "Confirmar exclusão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}