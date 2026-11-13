import { useId, useState, type FormEvent } from "react"
import { useUpdateProduct } from "../hooks/use-product"
import type { ProductDTO } from "../dtos/product.dto"
import { useCategories } from "@/cases/categories/hooks/use-category"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ProductEditDialogProps {
  product: ProductDTO
  onUpdated: () => void
}

function getInitialForm(product: ProductDTO) {
  return {
    name: product.name,
    description: product.description ?? "",
    price: String(product.price),
    picture: product.picture ?? "",
    categoryId: product.category?.id ?? "",
    active: product.active,
    isVegetarian: product.isVegetarian,
    isNew: product.isNew,
  }
}

export function ProductEditDialog({
  product,
  onUpdated,
}: ProductEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(() => getInitialForm(product))
  const [validation, setValidation] = useState("")

  const fieldId = useId()
  const updateProduct = useUpdateProduct()
  const categoriesQuery = useCategories()

  const categories = (categoriesQuery.data ?? []).filter(
    (category) =>
      category.active || category.id === product.category?.id,
  )

  function handleOpenChange(nextOpen: boolean) {
    if (updateProduct.isPending) return

    setOpen(nextOpen)

    if (nextOpen) {
      setForm(getInitialForm(product))
      setValidation("")
      updateProduct.reset()
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedPrice = form.price.trim().replace(",", ".")
    const price = Number(normalizedPrice)

    if (!form.name.trim() || form.name.trim().length > 60) {
      setValidation("Informe um nome de até 60 caracteres.")
      return
    }

    if (
      !/^\d+(\.\d{1,2})?$/.test(normalizedPrice) ||
      !Number.isFinite(price) ||
      price <= 0 ||
      price > 99999999.99
    ) {
      setValidation(
        "Informe um preço maior que zero, com até duas casas decimais e no máximo 99.999.999,99.",
      )
      return
    }

    if (categoriesQuery.isPending || categoriesQuery.isError) {
      setValidation("Aguarde o carregamento das categorias.")
      return
    }

    setValidation("")

    const originalCategoryId = product.category?.id ?? ""

    try {
      await updateProduct.mutateAsync({
        id: product.id,
        dto: {
          name: form.name.trim(),
          description: form.description.trim(),
          price,
          picture: form.picture.trim() || null,
          categoryId:
            form.categoryId === originalCategoryId
              ? undefined
              : form.categoryId || null,
          active: form.active,
          isVegetarian: form.isVegetarian,
          isNew: form.isNew,
        },
      })

      setOpen(false)
      onUpdated()
    } catch {
      // O erro será exibido usando updateProduct.isError.
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger
          render={<Button variant="outline" />}
          aria-label={`Editar ${product.name}`}
        >
          Editar
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar produto</DialogTitle>

            <DialogDescription>
              Altere os dados do produto do cardápio.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${fieldId}-name`}>Nome</Label>

              <Input
                id={`${fieldId}-name`}
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                maxLength={60}
                required
                disabled={updateProduct.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${fieldId}-description`}>
                Descrição
              </Label>

              <Textarea
                id={`${fieldId}-description`}
                value={form.description}
                onChange={(event) =>
                  setForm({
                    ...form,
                    description: event.target.value,
                  })
                }
                disabled={updateProduct.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${fieldId}-price`}>Preço (R$)</Label>

              <Input
                id={`${fieldId}-price`}
                inputMode="decimal"
                placeholder="Ex.: 25,90"
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: event.target.value })
                }
                required
                disabled={updateProduct.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${fieldId}-picture`}>
                URL da imagem
              </Label>

              <Input
                id={`${fieldId}-picture`}
                type="url"
                placeholder="https://..."
                value={form.picture}
                onChange={(event) =>
                  setForm({ ...form, picture: event.target.value })
                }
                disabled={updateProduct.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${fieldId}-category`}>
                Categoria
              </Label>

              <NativeSelect
                id={`${fieldId}-category`}
                value={form.categoryId}
                onChange={(event) =>
                  setForm({
                    ...form,
                    categoryId: event.target.value,
                  })
                }
                disabled={
                  updateProduct.isPending ||
                  categoriesQuery.isPending ||
                  categoriesQuery.isError
                }
              >
                <NativeSelectOption value="">
                  Sem categoria
                </NativeSelectOption>

                {categories.map((category) => (
                  <NativeSelectOption
                    key={category.id}
                    value={category.id}
                    disabled={!category.active}
                  >
                    {category.name}
                    {!category.active ? " (inativa)" : ""}
                  </NativeSelectOption>
                ))}
              </NativeSelect>

              {categoriesQuery.isPending && (
                <p role="status" className="text-sm">
                  Carregando categorias...
                </p>
              )}

              {categoriesQuery.isError && (
                <div role="alert" className="space-y-2">
                  <p className="text-sm text-destructive">
                    Não foi possível carregar as categorias.
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void categoriesQuery.refetch()}
                  >
                    Tentar novamente
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id={`${fieldId}-active`}
                checked={form.active}
                onCheckedChange={(checked) =>
                  setForm({ ...form, active: checked === true })
                }
                disabled={updateProduct.isPending}
              />

              <Label htmlFor={`${fieldId}-active`}>
                Produto ativo
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id={`${fieldId}-vegetarian`}
                checked={form.isVegetarian}
                onCheckedChange={(checked) =>
                  setForm({
                    ...form,
                    isVegetarian: checked === true,
                  })
                }
                disabled={updateProduct.isPending}
              />

              <Label htmlFor={`${fieldId}-vegetarian`}>
                Vegetariano
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id={`${fieldId}-new`}
                checked={form.isNew}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isNew: checked === true })
                }
                disabled={updateProduct.isPending}
              />

              <Label htmlFor={`${fieldId}-new`}>
                Novidade
              </Label>
            </div>

            {validation && (
              <p role="alert" className="text-sm text-destructive">
                {validation}
              </p>
            )}

            {updateProduct.isError && (
              <p role="alert" className="text-sm text-destructive">
                Não foi possível atualizar o produto.
                Verifique os dados e tente novamente.
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={updateProduct.isPending}
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={
                  updateProduct.isPending ||
                  categoriesQuery.isPending ||
                  categoriesQuery.isError
                }
              >
                {updateProduct.isPending ? "Salvando..." : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}