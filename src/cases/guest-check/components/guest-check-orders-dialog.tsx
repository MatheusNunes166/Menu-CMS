import type { GuestCheckDTO } from "../dtos/guest-check.dto"
import type {
    OrderDTO,
    OrderStatus,
} from "@/cases/orders/dtos/order.dto"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { OrderStatusAction } from "@/cases/orders/components/order-status-action"

interface GuestCheckOrdersDialogProps {
    guestCheck: GuestCheckDTO
    orders: OrderDTO[]
}

const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
})

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
})

const statusConfig: Record<
    OrderStatus,
    { label: string; className: string }
> = {
    NEW: {
        label: "Novo",
        className: "border-yellow-200 bg-yellow-100 text-yellow-900",
    },
    PREPARING: {
        label: "Preparando",
        className: "border-blue-200 bg-blue-100 text-blue-900",
    },
    READY: {
        label: "Pronto",
        className: "border-green-200 bg-green-100 text-green-900",
    },
    DELIVERY: {
        label: "Entregue",
        className: "border-slate-200 bg-slate-100 text-slate-900",
    },
}

export function GuestCheckOrdersDialog({
    guestCheck,
    orders,
}: GuestCheckOrdersDialogProps) {
    return (
        <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
                Ver pedidos
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>
                        Pedidos — {guestCheck.spot.name}
                    </DialogTitle>

                    <DialogDescription>
                        Confira os itens, valores e status dos pedidos desta comanda.
                    </DialogDescription>
                </DialogHeader>

                {orders.length === 0 ? (
                    <p>Nenhum pedido nesta comanda.</p>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <article
                                key={order.id}
                                className="rounded-lg border p-4"
                            >
                                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold">
                                            Pedido {order.id.slice(0, 8)}
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            {dateFormatter.format(new Date(order.createdAt))}
                                        </p>
                                    </div>

                                    <Badge
                                        variant="outline"
                                        className={statusConfig[order.status].className}
                                    >
                                        {statusConfig[order.status].label}
                                    </Badge>
                                </div>

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produto</TableHead>
                                            <TableHead>Quantidade</TableHead>
                                            <TableHead>Preço unitário</TableHead>
                                            <TableHead>Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {order.items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.product.name}</TableCell>

                                                <TableCell>{item.quantity}</TableCell>

                                                <TableCell>
                                                    {currency.format(Number(item.price))}
                                                </TableCell>

                                                <TableCell>
                                                    {currency.format(Number(item.subtotal))}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <p className="mt-4 text-right font-semibold">
                                    Total do pedido:{" "}
                                    {currency.format(Number(order.total))}
                                </p>
                                <div className="mt-4">
                                    <OrderStatusAction order={order} />
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}