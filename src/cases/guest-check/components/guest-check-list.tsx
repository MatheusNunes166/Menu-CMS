import { useOpenedGuestChecks } from "../hooks/use-guest-check"
import { useOrders } from "@/cases/orders/hooks/use-order"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { GuestCheckOrdersDialog } from "./guest-check-orders-dialog"

const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
})

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
})

export function GuestCheckList() {
    const guestChecksQuery = useOpenedGuestChecks()
    const ordersQuery = useOrders()

    const guestChecks = (guestChecksQuery.data ?? []).filter(
        (guestCheck) => guestCheck.status === "OPENED",
    )

    const orders = ordersQuery.data ?? []

    function getTotal(guestCheckId: string) {
        const totalInCents = orders
            .filter((order) => order.guestCheck.id === guestCheckId)
            .reduce(
                (total, order) =>
                    total + Math.round(Number(order.total) * 100),
                0,
            )

        return totalInCents / 100
    }

    if (guestChecksQuery.isPending || ordersQuery.isPending) {
        return <p role="status">Carregando comandas e totais...</p>
    }

    if (guestChecksQuery.isError || ordersQuery.isError) {
        return (
            <div role="alert">
                <p className="mb-3 text-destructive">
                    Não foi possível carregar as comandas e seus totais.
                </p>

                <Button
                    variant="outline"
                    onClick={() => {
                        void guestChecksQuery.refetch()
                        void ordersQuery.refetch()
                    }}
                >
                    Tentar novamente
                </Button>
            </div>
        )
    }

    if (guestChecks.length === 0) {
        return <p>Nenhuma comanda aberta.</p>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Mesa</TableHead>
                    <TableHead>Data de abertura</TableHead>
                    <TableHead>Total acumulado</TableHead>
                    <TableHead>Ações</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {guestChecks.map((guestCheck) => (
                    <TableRow key={guestCheck.id}>
                        <TableCell>{guestCheck.spot.name}</TableCell>

                        <TableCell>
                            {dateFormatter.format(
                                new Date(guestCheck.createdAt),
                            )}
                        </TableCell>

                        <TableCell>
                            {currency.format(getTotal(guestCheck.id))}
                        </TableCell>
                        <TableCell>
                            <GuestCheckOrdersDialog
                                guestCheck={guestCheck}
                                orders={orders.filter(
                                    (order) => order.guestCheck.id === guestCheck.id,
                                )}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}