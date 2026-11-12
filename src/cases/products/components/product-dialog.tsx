import { useId, useState, type FormEvent } from "react"
import { useCreateProduct } from "../hooks/use-product"
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

const initialForm = {
  name: "",
  description: "",
  price: "",
  picture: "",
  categoryId: "",
  active: true,
  isVegetarian: false,
  isNew: false,
}

export function ProductDialog() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ ...initialForm })
  const [validation, setValidation] = useState("")
  const [success, setSuccess] = useState(false)

  const fieldId = useId()
  const createProduct = useCreateProduct()
  const categoriesQuery = useCategories()

  const categories = (categoriesQuery.data ?? []).filter(
    (category) => category.active,
  )

  function handleOpenChange(nextOpen: boolean) {
    if (createProduct.isPending) return

    setOpen(nextOpen)

    if (nextOpen) {
      setForm({ ...initialForm })
      setValidation("")
      setSuccess(false)
      createProduct.reset()
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    createProduct.mutate(
      {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price,
        picture: form.picture.trim() || undefined,
        categoryId: form.categoryId || undefined,
        active: form.active,
        isVegetarian: form.isVegetarian,
        isNew: form.isNew,
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
          Novo produto
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo produto</DialogTitle>

            <DialogDescription>
              Preencha os dados do produto do cardápio.
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
                disabled={createProduct.isPending}
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
                disabled={createProduct.isPending}
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
                disabled={createProduct.isPending}
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
                disabled={createProduct.isPending}
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
                  createProduct.isPending ||
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
                  >
                    {category.name}
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
                disabled={createProduct.isPending}
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
                disabled={createProduct.isPending}
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
                disabled={createProduct.isPending}
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

            {createProduct.isError && (
              <p role="alert" className="text-sm text-destructive">
                Não foi possível cadastrar o produto.
                Verifique os dados e tente novamente.
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={createProduct.isPending}
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={
                  createProduct.isPending ||
                  categoriesQuery.isPending ||
                  categoriesQuery.isError
                }
              >
                {createProduct.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {success && (
        <p role="status" className="mt-2 text-sm text-green-700">
          Produto cadastrado com sucesso!
        </p>
      )}
    </div>
  )
}