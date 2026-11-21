# Menu CMS — Cardápio Digital

Sistema de gerenciamento de conteúdo para administrar o cardápio digital de um restaurante e acompanhar seus pedidos.

O projeto consome uma API REST desenvolvida em NestJS, com persistência em PostgreSQL. Os dados exibidos são obtidos pela API.

## Tecnologias

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui com Base UI
- Axios
- TanStack Query
- @dnd-kit/core

## Funcionalidades

### Categorias

- Listagem com nome, ícone, ordem de exibição e situação.
- Cadastro e edição.
- Exclusão com confirmação.
- Ícones carregados por URLs públicas do Supabase Storage.

### Produtos

- Listagem com imagem, nome, categoria e preço em reais.
- Indicadores de vegetariano e novidade.
- Filtro por categoria.
- Cadastro e edição com categoria selecionada a partir da API.
- Exclusão com confirmação.
- Validação dos campos obrigatórios e do preço maior que zero.

### Mesas

- Listagem das mesas e suas situações.
- Cadastro e edição.
- Exclusão com confirmação.

### Comandas

- Listagem somente das comandas abertas.
- Exibição da mesa, data de abertura e total acumulado.
- Consulta dos pedidos vinculados a cada comanda.

As comandas são abertas automaticamente pelo backend quando necessário ao criar um pedido. O CMS não oferece cadastro de comandas.

### Pedidos

- Exibição dos produtos, quantidades, preços unitários e subtotais.
- Exibição do total de cada pedido.
- Identificação visual dos status por badges.
- Atualização de status pela API.

### Kanban

- Uma coluna para cada status da API:
  - `NEW`: novo.
  - `PREPARING`: preparando.
  - `READY`: pronto.
  - `DELIVERY`: entregue.
- Cartões com mesa, itens, data e total do pedido.
- Alteração de status ao arrastar um cartão entre colunas.
- Persistência da alteração no backend.
- Posição dos cartões recuperada a partir da API ao recarregar a página.

O identificador `DELIVERY` foi mantido conforme o enum utilizado pelo backend.

### Interface

- Navegação entre as áreas do CMS.
- Estados de carregamento, erro e lista vazia.
- Mensagens de sucesso e erro nas operações.
- Confirmação antes das exclusões.
- Identidade visual com cores bege, verde e laranja.

## Pré-requisitos

- Node.js compatível com a versão do Vite utilizada.
- npm.
- Backend NestJS em execução e conectado ao banco de dados.

Recomenda-se Node.js 24.

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/MatheusNunes166/Menu-CMS.git
cd Menu-CMS
npm install
```

## Configuração

Na raiz do projeto, crie um arquivo `.env` com base no `.env.example`:

```env
VITE_API_URL=http://localhost:3000
```

A variável `VITE_API_URL` define o endereço do backend.

Se a API estiver em outro endereço ou porta, ajuste essa variável. Reinicie o Vite após alterar o arquivo `.env`.

O arquivo `.env.example` deve ser versionado. O `.env` deve permanecer no `.gitignore`.

## Executar

Com o backend funcionando, execute:

```bash
npm run dev
```

Abra o endereço informado pelo Vite no terminal.

Caso a porta padrão esteja ocupada, o Vite poderá utilizar outra porta. Utilize o endereço exibido no terminal.

## Gerar a versão de produção

```bash
npm run build
```

Para visualizar localmente a versão gerada:

```bash
npm run preview
```

O frontend continua dependendo da API para consultar e alterar os dados.

## Organização do projeto

```text
src/
  cases/
    categories/
    products/
    spots/
    guest-check/
    orders/
  components/
    ui/
  lib/
    axios.ts
  App.tsx
  main.tsx
  index.css
```

Cada funcionalidade é organizada em:

- `dtos`: tipos dos dados recebidos e enviados.
- `services`: chamadas HTTP usando a instância compartilhada do Axios.
- `hooks`: consultas e alterações com TanStack Query.
- `components`: interface, formulários, listagens e diálogos.

As leituras usam `useQuery`, e as gravações usam `useMutation`. Após alterações bem-sucedidas, as consultas afetadas são invalidadas com `invalidateQueries`.

## Dependências adicionais e justificativas

| Dependência | Justificativa |
| --- | --- |
| `@dnd-kit/core` | Implementação do arrastar e soltar dos pedidos no Kanban. |
| `@base-ui/react` | Base de comportamento e acessibilidade dos componentes shadcn/ui utilizados no projeto. |
| `@fontsource-variable/inter` | Disponibilização da fonte Inter utilizada na interface. |
| `tw-animate-css` | Animações utilizadas pelos componentes da interface. |

As dependências e suas versões estão declaradas no `package.json`.

## Imagens

As imagens dos produtos e os ícones das categorias são referenciados por URLs salvas no banco de dados.

Os arquivos utilizados ficam no Supabase Storage e precisam estar acessíveis pelos endereços públicos cadastrados.

## Verificação manual

1. Cadastrar, editar e excluir uma categoria de teste.
2. Cadastrar um produto e testar o filtro por categoria.
3. Editar o produto e conferir a persistência após recarregar.
4. Cadastrar, editar e excluir uma mesa de teste.
5. Consultar uma comanda aberta e conferir seus pedidos e total.
6. Mover um pedido entre colunas do Kanban.
7. Recarregar a página e confirmar que o status foi mantido.