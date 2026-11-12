import { useState } from "react"
import { useProducts } from "../hooks/use-product"
import { useCategories } from "@/cases/categories/hooks/use-category"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function ProductList() {
  const [categoryId, setCategoryId] = useState("")

  const productsQuery = useProducts()
  const categoriesQuery = useCategories()

  const products = productsQuery.data ?? []
  const categories = categoriesQuery.data ?? []

  const filteredProducts = categoryId
    ? products.filter(
        (product) => product.category?.id === categoryId,
      )
    : products

  if (productsQuery.isPending) {
    return <p role="status">Carregando produtos...</p>
  }

  if (productsQuery.isError) {
    return (
      <div role="alert">
        <p className="mb-3 text-destructive">
          Não foi possível carregar os produtos.
        </p>

        <Button
          variant="outline"
          onClick={() => void productsQuery.refetch()}
        >
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="max-w-xs space-y-2">
        <label
          htmlFor="product-category-filter"
          className="text-sm font-medium"
        >
          Filtrar por categoria
        </label>

        <NativeSelect
          id="product-category-filter"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          disabled={
            categoriesQuery.isPending || categoriesQuery.isError
          }
        >
          <NativeSelectOption value="">
            Todas as categorias
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
              Não foi possível carregar o filtro.
            </p>

            <Button
              variant="outline"
              onClick={() => void categoriesQuery.refetch()}
            >
              Recarregar categorias
            </Button>
          </div>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <p>
          {products.length === 0
            ? "Nenhum produto cadastrado."
            : "Nenhum produto nesta categoria."}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Vegetariano</TableHead>
              <TableHead>Novidade</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.picture ? (
                    <img
                      src={product.picture}
                      alt={product.name}
                      className="size-14 rounded-md object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground">
                      Sem imagem
                    </span>
                  )}
                </TableCell>

                <TableCell>{product.name}</TableCell>

                <TableCell>
                  {product.category?.name ?? "Sem categoria"}
                </TableCell>

                <TableCell>
                  {currency.format(Number(product.price))}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      product.isVegetarian ? "default" : "secondary"
                    }
                  >
                    {product.isVegetarian ? "Sim" : "Não"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={product.isNew ? "default" : "secondary"}
                  >
                    {product.isNew ? "Sim" : "Não"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}