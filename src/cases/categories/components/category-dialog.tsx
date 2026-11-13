import { useId, useState, type FormEvent } from "react"
import { useCreateCategory } from "../hooks/use-category"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox" 
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
  const [icon, setIcon] = useState("")
  const [displayOrder, setDisplayOrder] = useState("0")
  const [validation, setValidation] = useState("")
  const [success, setSuccess] = useState(false)
  const [active, setActive] = useState(true)

  const nameId = useId()
  const iconId = useId()
  const orderId = useId()
  const activeId = useId()
  const createCategory = useCreateCategory()

  function handleOpenChange(nextOpen: boolean) {
    if (createCategory.isPending) return

    setOpen(nextOpen)

    if (nextOpen) {
      setName("")
      setIcon("")
      setActive(true)
      setDisplayOrder("0")
      setValidation("")
      setSuccess(false)
      createCategory.reset()
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const order = Number(displayOrder)

    if (!name.trim() || name.trim().length > 60) {
      setValidation("Informe um nome de até 60 caracteres.")
      return
    }


    if (
      displayOrder.trim() === "" ||
      !Number.isInteger(order) ||
      order < 0 ||
      order > 2147483647
    ) {
      setValidation(
        "A ordem deve ser um número inteiro entre 0 e 2147483647.",
      )
      return
    }

    setValidation("")

    createCategory.mutate(
      {
        name: name.trim(),
        icon: icon.trim(),
        displayOrder: order,
        active,
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
          Nova categoria
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova categoria</DialogTitle>

            <DialogDescription>
              Informe os dados da categoria do cardápio.
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

            <div className="space-y-2">
              <Label htmlFor={iconId}>Url do ícone</Label>

              <Input
                id={iconId}
                type="url"
                value={icon}
                onChange={(event) => setIcon(event.target.value)}
                placeholder="https://.../icons/icon-bebida.svg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={orderId}>Ordem de exibição</Label>

              <Input
                id={orderId}
                type="number"
                min={0}
                max={2147483647}
                step={1}
                value={displayOrder}
                onChange={(event) =>
                  setDisplayOrder(event.target.value)
                }
                required
                disabled={createCategory.isPending}
              />
            </div>

            <div className= "flex items-center gap-2">
              <Checkbox
              id={activeId}
              checked={active}
              onCheckedChange={(checked)=> setActive(checked === true)}
              disabled={createCategory.isPending}
            />
            <label htmlFor={activeId}>Categoria Ativa</label>
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