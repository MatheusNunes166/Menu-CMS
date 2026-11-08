import { useId, useState, type FormEvent } from "react"
import { useCreateCategory } from "../hooks/use-category"
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

export function CategoryDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [validation, setValidation] = useState("")
  const [success, setSuccess] = useState(false)

  const nameId = useId()
  const createCategory = useCreateCategory()

  function handleOpenChange(nextOpen: boolean) {
    if (createCategory.isPending) return

    setOpen(nextOpen)

    if (nextOpen) {
      setName("")
      setValidation("")
      setSuccess(false)
      createCategory.reset()
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim()) {
      setValidation("Informe o nome da categoria.")
      return
    }

    setValidation("")

    createCategory.mutate(
      { name: name.trim() },
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
          Nova categoria
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova categoria</DialogTitle>
            <DialogDescription>
              Informe o nome da categoria do cardápio.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={nameId}>Nome</Label>

              <Input
                id={nameId}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex.: Bebidas"
                maxLength={60}
                required
                disabled={createCategory.isPending}
              />
            </div>

            {validation && (
              <p role="alert" className="text-sm text-destructive">
                {validation}
              </p>
            )}

            {createCategory.isError && (
              <p role="alert" className="text-sm text-destructive">
                Não foi possível cadastrar a categoria.
                Confira a conexão com a API e tente novamente.
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={createCategory.isPending}
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={createCategory.isPending}
              >
                {createCategory.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {success && (
        <p role="status" className="mt-2 text-sm text-green-700">
          Categoria cadastrada com sucesso!
        </p>
      )}
    </div>
  )
}