import { useState } from "react"
import type { SpotDTO } from "../dtos/spot.dto"
import { useDeleteSpot } from "../hooks/use-spot"
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

interface SpotDeleteDialogProps {
  spot: SpotDTO
  onDeleted: () => void
}

export function SpotDeleteDialog({
  spot,
  onDeleted,
}: SpotDeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const deleteSpot = useDeleteSpot()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteSpot.isPending) return

    setOpen(nextOpen)

    if (nextOpen) {
      deleteSpot.reset()
    }
  }

  async function handleDelete() {
    try {
      await deleteSpot.mutateAsync(spot.id)
      setOpen(false)
      onDeleted()
    } catch {
      // O erro será exibido usando deleteSpot.isError.
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="destructive" />}>
        Excluir
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir mesa?</DialogTitle>

          <DialogDescription>
            Deseja excluir a mesa “{spot.name}”?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        {deleteSpot.isError && (
          <p role="alert" className="text-sm text-destructive">
            Não foi possível excluir a mesa.
            Confira o erro no backend e tente novamente.
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={deleteSpot.isPending}
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={deleteSpot.isPending}
            onClick={handleDelete}
          >
            {deleteSpot.isPending
              ? "Excluindo..."
              : "Confirmar exclusão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}