import { useState } from "react"
import type { ProductDTO } from "../dtos/product.dto"
import { useDeleteProduct } from "../hooks/use-product"
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

interface ProductDeleteDialogProps {
  product: ProductDTO
  onDeleted: () => void
}

export function ProductDeleteDialog({
  product,
  onDeleted,
}: ProductDeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const deleteProduct = useDeleteProduct()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteProduct.isPending) return

    setOpen(nextOpen)

    if (nextOpen) {
      deleteProduct.reset()
    }
  }

  async function handleDelete() {
    try {
      await deleteProduct.mutateAsync(product.id)
      setOpen(false)
      onDeleted()
    } catch {
      // O erro será exibido usando deleteProduct.isError.
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="destructive" />}>
        Excluir
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir produto?</DialogTitle>

          <DialogDescription>
            Deseja excluir o produto “{product.name}”?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        {deleteProduct.isError && (
          <p role="alert" className="text-sm text-destructive">
            Não foi possível excluir o produto.
            Ele pode estar vinculado a pedidos.
            Confira o erro no backend.
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={deleteProduct.isPending}
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={deleteProduct.isPending}
            onClick={handleDelete}
          >
            {deleteProduct.isPending
              ? "Excluindo..."
              : "Confirmar exclusão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}