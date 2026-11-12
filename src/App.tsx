/* eslint-disable @typescript-eslint/no-unused-vars */
import { CategoryList } from "./cases/categories/components/category-list"
import { CategoryDialog } from "./cases/categories/components/category-dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProductList } from "./cases/products/components/product-list"
import { ProductDialog } from "./cases/products/components/product-dialog"


function App(){
  const [page, setPage] = useState<"categories" | "products">(
    "categories"
  )

  return(
    <main className="min-h-screen bg-background p-8 text-foreground">
      <h1 className="mb-2 text-3xl font-bold">Menu CMS</h1>

      <p className="mb-8 text-muted-foreground">
        Administração do cardápio digital
      </p>


      <nav
      aria-label="Áreas do CMS"
      className="mb-8 flex gap-2"
      >
        <Button
          variant={page==="categories" ? "default":"outline"}
          aria-pressed={page ==="categories"}
          onClick={() => setPage("categories")}
          >
            Categorias
          </Button>
        
        <Button
          variant={page === "products" ? "default" : "outline"}
          aria-pressed={page === "products"}
          onClick={() => setPage("products")}
        >
          Produtos
        </Button>
      </nav>
      {page === "categories" ?(
      <section>
        <div className="mb-6 flex itens-center justify-between gap-4">
          <h2 className="text-2x1 font-semibold">Categorias</h2>
          <CategoryDialog />
      </div>
      <CategoryList/>
     </section>
     ):(
      <section>
        <div className="mb-6 flex items-start justify-between gap-4">
        <h2 className="mb-6 text-2xl font-semibold">Produtos</h2>
        <ProductDialog />
        </div>
        <ProductList />
      </section>
     )}
    </main>
  )
}
export default App