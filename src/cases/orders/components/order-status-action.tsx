import { useState } from "react"
import type { OrderDTO, OrderStatus } from "../dtos/order.dto"
import { useUpdateOrderStatus } from "../hooks/use-order"
import { Button } from "@/components/ui/button"

interface OrderStatusActionProps {
  order: OrderDTO
}

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  NEW: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERY",
  DELIVERY: null,
}

const buttonLabels: Record<OrderStatus, string> = {
  NEW: "Iniciar preparo",
  PREPARING: "Marcar como pronto",
  READY: "Marcar como entregue",
  DELIVERY: "Pedido entregue",
}

export function OrderStatusAction({
  order,
}: OrderStatusActionProps) {
  const [success, setSuccess] = useState("")
  const updateStatus = useUpdateOrderStatus()

  const targetStatus = nextStatus[order.status]

  function handleUpdate() {
    if (!targetStatus || updateStatus.isPending) return

    setSuccess("")

    updateStatus.mutate(
      {
        id: order.id,
        dto: {
          status: targetStatus,
        },
      },
      {
        onSuccess: () => {
          setSuccess("Status atualizado com sucesso!")
        },
      },
    )
  }

  return (
    <div className="space-y-2">
      {targetStatus ? (
        <Button
          type="button"
          disabled={updateStatus.isPending}
          onClick={handleUpdate}
        >
          {updateStatus.isPending
            ? "Atualizando..."
            : buttonLabels[order.status]}
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">
          Pedido entregue.
        </p>
      )}

      {success && (
        <p role="status" className="text-sm text-green-700">
          {success}
        </p>
      )}

      {updateStatus.isError && (
        <p role="alert" className="text-sm text-destructive">
          Não foi possível alterar o status.
          Atualize a consulta e tente novamente.
        </p>
      )}
    </div>
  )
}