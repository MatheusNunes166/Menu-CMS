import { useRef, useState } from "react"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import type { OrderDTO, OrderStatus } from "../dtos/order.dto"
import { useOrders, useUpdateOrderStatus } from "../hooks/use-order"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const columns: {
  status: OrderStatus
  title: string
  className: string
}[] = [
  {
    status: "NEW",
    title: "Novos",
    className: "border-yellow-300 bg-yellow-50",
  },
  {
    status: "PREPARING",
    title: "Preparando",
    className: "border-blue-300 bg-blue-50",
  },
  {
    status: "READY",
    title: "Prontos",
    className: "border-green-300 bg-green-50",
  },
  {
    status: "DELIVERY",
    title: "Entregues",
    className: "border-slate-300 bg-slate-100",
  },
]

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
})

function OrderContent({ order }: { order: OrderDTO }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-semibold">
          {order.guestCheck.spot.name}
        </h3>

        <p className="text-xs text-muted-foreground">
          Pedido {order.id.slice(0, 8)}
        </p>

        <p className="text-xs text-muted-foreground">
          {dateFormatter.format(new Date(order.createdAt))}
        </p>
      </div>

      <ul className="space-y-1 text-sm">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.quantity} × {item.product.name}
          </li>
        ))}
      </ul>

      <p className="border-t pt-2 text-sm font-semibold">
        {currency.format(Number(order.total))}
      </p>
    </div>
  )
}

function OrderCard({
  order,
  disabled,
}: {
  order: OrderDTO
  disabled: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    isDragging,
  } = useDraggable({
    id: order.id,
    disabled,
  })

  return (
    <article
      ref={setNodeRef}
      className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm"
      style={{ opacity: isDragging ? 0.35 : 1 }}
    >
      <div className="mb-2 flex justify-end">
        <Button
          ref={setActivatorNodeRef}
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className="cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
          {...attributes}
          {...listeners}
          aria-label={`Mover pedido ${order.id.slice(0, 8)}`}
        >
          <span aria-hidden="true">⠿</span>
          Mover
        </Button>
      </div>

      <OrderContent order={order} />
    </article>
  )
}

function KanbanColumn({
  column,
  orders,
  disabled,
}: {
  column: (typeof columns)[number]
  orders: OrderDTO[]
  disabled: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.status,
    disabled,
  })

  return (
    <section
      ref={setNodeRef}
      className={`min-h-80 rounded-xl border p-3 ${column.className} ${
        isOver ? "ring-2 ring-primary" : ""
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-semibold text-slate-900">
          {column.title}
        </h2>

        <Badge variant="secondary">{orders.length}</Badge>
      </div>

      <div className="space-y-3">
        {orders.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-600">
            Nenhum pedido nesta coluna.
          </p>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              disabled={disabled}
            />
          ))
        )}
      </div>
    </section>
  )
}

export function OrderKanban() {
  const ordersQuery = useOrders()
  const updateStatus = useUpdateOrderStatus()

  const [activeId, setActiveId] = useState<string | null>(null)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const saving = useRef(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor),
  )

  const orders = ordersQuery.data ?? []
  const activeOrder = orders.find((order) => order.id === activeId)

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)

    const { active, over } = event

    if (!over || saving.current) return

    const destination = columns.find(
      (column) => column.status === over.id,
    )

    const order = orders.find(
      (item) => item.id === String(active.id),
    )

    if (
      !destination ||
      !order ||
      order.status === destination.status
    ) {
      return
    }

    saving.current = true
    setSuccess("")
    setError("")

    try {
      await updateStatus.mutateAsync({
        id: order.id,
        dto: {
          status: destination.status,
        },
      })

      setSuccess("Status atualizado e salvo na API!")
    } catch {
      setError(
        "Não foi possível salvar a mudança. Confira a conexão e as regras de status do backend.",
      )

      void ordersQuery.refetch()
    } finally {
      saving.current = false
    }
  }

  if (ordersQuery.isPending) {
    return <p role="status">Carregando pedidos...</p>
  }

  if (ordersQuery.isError) {
    return (
      <div role="alert" className="space-y-3">
        <p className="text-destructive">
          Não foi possível carregar os pedidos.
        </p>

        <Button
          variant="outline"
          onClick={() => void ordersQuery.refetch()}
        >
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Arraste pelo botão Mover e solte na coluna desejada.
        </p>

        <Button
          variant="outline"
          disabled={ordersQuery.isFetching || updateStatus.isPending}
          onClick={() => void ordersQuery.refetch()}
        >
          Atualizar pedidos
        </Button>
      </div>

      {updateStatus.isPending && (
        <p role="status" className="text-sm">
          Salvando mudança de status...
        </p>
      )}

      {success && (
        <p role="status" className="text-sm text-green-700">
          {success}
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={({ active }) => {
          setActiveId(String(active.id))
        }}
        onDragCancel={() => setActiveId(null)}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.status}
              column={column}
              orders={orders.filter(
                (order) => order.status === column.status,
              )}
              disabled={updateStatus.isPending}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeOrder ? (
            <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-xl">
              <OrderContent order={activeOrder} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}