import { useId, useState, type FormEvent } from "react"
import type { SpotDTO } from "../dtos/spot.dto"
import { useUpdateSpot } from "../hooks/use-spot"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface SpotEditDialogProps {
  spot: SpotDTO
  onUpdated: () => void
}

export function SpotEditDialog({
  spot,
  onUpdated,
}: SpotEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(spot.name)
  const [active, setActive] = useState(spot.active)
  const [validation, setValidation] = useState("")

  const nameId = useId()
  const activeId = useId()
  const updateSpot = useUpdateSpot()

  function handleOpenChange(nextOpen: boolean) {
    if (updateSpot.isPending) return

    setOpen(nextOpen)

    if (nextOpen) {
      setName(spot.name)
      setActive(spot.active)
      setValidation("")
      updateSpot.reset()
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim() || name.trim().length > 60) {
      setValidation("Informe um nome de até 60 caracteres.")
      return
    }

    setValidation("")

    try {
      await updateSpot.mutateAsync({
        id: spot.id,
        dto: {
          name: name.trim(),
          active,
        },
      })

      setOpen(false)
      onUpdated()
    } catch {
      // O erro será exibido usando updateSpot.isError.
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" />}>
        Editar
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar mesa</DialogTitle>

          <DialogDescription>
            Altere o nome e a situação da mesa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={nameId}>Nome</Label>

            <Input
              id={nameId}
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={60}
              required
              disabled={updateSpot.isPending}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id={activeId}
              checked={active}
              onCheckedChange={(checked) => setActive(checked === true)}
              disabled={updateSpot.isPending}
            />

            <Label htmlFor={activeId}>Mesa ativa</Label>
          </div>

          {validation && (
            <p role="alert" className="text-sm text-destructive">
              {validation}
            </p>
          )}

          {updateSpot.isError && (
            <p role="alert" className="text-sm text-destructive">
              Não foi possível atualizar a mesa.
              Tente novamente.
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={updateSpot.isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={updateSpot.isPending}
            >
              {updateSpot.isPending
                ? "Salvando..."
                : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}