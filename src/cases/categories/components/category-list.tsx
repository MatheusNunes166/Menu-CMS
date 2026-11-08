import { useCategories } from "../hooks/use-category"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function CategoryList() {
  const {
    data: categories = [],
    isPending,
    isError,
    refetch,
  } = useCategories()

  if (isPending) {
    return <p role="status">Carregando categorias...</p>
  }

  if (isError) {
    return (
      <div role="alert">
        <p className="mb-3 text-destructive">
          Não foi possível carregar as categorias.
        </p>

        <Button
          variant="outline"
          onClick={() => void refetch()}
        >
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (categories.length === 0) {
    return <p>Nenhuma categoria cadastrada.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Situação</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>{category.name}</TableCell>

            <TableCell>
              {category.active ? "Ativa" : "Inativa"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}