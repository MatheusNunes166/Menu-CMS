import { CategoryList } from "./cases/categories/components/category-list"
import { CategoryDialog } from "./cases/categories/components/category-dialog"

function App(){
  return(
    <main className="min-h-screen bg-background p-8 text-foreground">
      <h1 className="mb-2 text-3xl font-bold">Menu CMS</h1>

      <p className="mb-8 text-muted-foreground">
        Administração do cardápio digital
      </p>

      <section>
        <div className="mb-6 flex itens-center justify-between gap-4">
          <h2 className="text-2x1 font-semibold">Categorias</h2>
          <CategoryDialog />
      </div>
      <CategoryList/>
     </section>
    </main>
  )
}
export default App