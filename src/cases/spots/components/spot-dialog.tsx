import { useId, useState, type FormEvent } from "react"
import { useCreateSpot } from "../hooks/use-spot"
import { Button } from "@/components/ui/button"
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

export function SpotDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [validation, setValidation] = useState("")
  const [success, setSuccess] = useState(false)

  const nameId = useId()
  const createSpot = useCreateSpot()

  function handleOpenChange(nextOpen: boolean) {
    if (createSpot.isPending) return

    setOpen(nextOpen)

    if (nextOpen) {
      setName("")
      setValidation("")
      setSuccess(false)
      createSpot.reset()
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim() || name.trim().length > 60) {
      setValidation("Informe um nome de até 60 caracteres.")
      return
    }

    setValidation("")

    createSpot.mutate(
      {
        name: name.trim(),
      },
      {
        onSuccess: () => {
          setOpen(false)
          setSuccess(true)
        },
      },
    )
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger render={<Button />}>
          Nova mesa
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova mesa</DialogTitle>

            <DialogDescription>
              Informe o nome da mesa do restaurante.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={nameId}>Nome</Label>

              <Input
                id={nameId}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex.: Mesa 01"
                maxLength={60}
                required
                disabled={createSpot.isPending}
              />
            </div>

            {validation && (
              <p role="alert" className="text-sm text-destructive">
                {validation}
              </p>
            )}

            {createSpot.isError && (
              <p role="alert" className="text-sm text-destructive">
                Não foi possível cadastrar a mesa.
                Confira a conexão com a API e tente novamente.
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={createSpot.isPending}
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={createSpot.isPending}
              >
                {createSpot.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {success && (
        <p role="status" className="mt-2 text-sm text-green-700">
          Mesa cadastrada com sucesso!
        </p>
      )}
    </div>
  )
}