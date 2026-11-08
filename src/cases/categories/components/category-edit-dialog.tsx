import { useId, useState, type FormEvent } from "react"
import type { CategoryDTO } from "../dtos/category.dto"
import { useUpdateCategory } from "../hooks/use-category"
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

interface CategoryEditDialogProps {
  category: CategoryDTO
}

export function CategoryEditDialog({
  category,
}: CategoryEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(category.name)
  const [icon, setIcon] = useState(category.icon ?? "")
  const [displayOrder, setDisplayOrder] = useState(
    String(category.displayOrder ?? 0),
  )
  const [active, setActive] = useState(category.active)
  const [validation, setValidation] = useState("")
  const [success, setSuccess] = useState(false)

  const nameId = useId()
  const iconId = useId()
  const orderId = useId()
  const activeId = useId()
  const updateCategory = useUpdateCategory()

  function handleOpenChange(nextOpen: boolean) {
    if (updateCategory.isPending) return

    setOpen(nextOpen)

    if (nextOpen) {
      setName(category.name)
      setIcon(category.icon ?? "")
      setDisplayOrder(String(category.displayOrder ?? 0))
      setActive(category.active)
      setValidation("")
      setSuccess(false)
      updateCategory.reset()
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const order = Number(displayOrder)

    if (!name.trim() || name.trim().length > 60) {
      setValidation("Informe um nome de até 60 caracteres.")
      return
    }

    if (icon.trim().length > 60) {
      setValidation("O ícone deve ter até 60 caracteres.")
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

    updateCategory.mutate(
      {
        id: category.id,
        dto: {
          name: name.trim(),
          icon: icon.trim(),
          displayOrder: order,
          active,
        },
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
    <div className="w-16 shrink-0">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger render={<Button variant="outline" />}>
          Editar
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar categoria</DialogTitle>

            <DialogDescription>
              Altere os dados da categoria do cardápio.
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
                disabled={updateCategory.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={iconId}>Ícone</Label>

              <Input
                id={iconId}
                value={icon}
                onChange={(event) => setIcon(event.target.value)}
                placeholder="Ex.: 🍔"
                maxLength={60}
                disabled={updateCategory.isPending}
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
                disabled={updateCategory.isPending}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id={activeId}
                checked={active}
                onCheckedChange={(checked) =>
                  setActive(checked === true)
                }
                disabled={updateCategory.isPending}
              />

              <Label htmlFor={activeId}>Categoria ativa</Label>
            </div>

            {validation && (
              <p role="alert" className="text-sm text-destructive">
                {validation}
              </p>
            )}

            {updateCategory.isError && (
              <p role="alert" className="text-sm text-destructive">
                Não foi possível atualizar a categoria.
                Tente novamente.
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={updateCategory.isPending}
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={updateCategory.isPending}
              >
                {updateCategory.isPending
                  ? "Salvando..."
                  : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {success && (
        <p role="status" className="mt-2 text-xs text-green-700">
          Categoria atualizada!
        </p>
      )}
    </div>
  )
}