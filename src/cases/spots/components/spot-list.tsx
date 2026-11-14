import { useSpots } from "../hooks/use-spot"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SpotEditDialog } from "./spot-edit-dialog"
import { useState } from "react"

export function SpotList() {
    const {
        data: spots = [],
        isPending,
        isError,
        refetch,
    } = useSpots()

    const [success, setSuccess] = useState("")

    if (isPending) {
        return <p role="status">Carregando mesas...</p>
    }

    if (isError) {
        return (
            <div role="alert">
                <p className="mb-3 text-destructive">
                    Não foi possível carregar as mesas.
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

    if (spots.length === 0) {
        return <p>Nenhuma mesa cadastrada.</p>
    }

    return (
        <div className="space-y-4">
            {success && (
                <p role="status" className="text-sm text-green-700">
                    {success}
                </p>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Situação</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {spots.map((spot) => (
                        <TableRow key={spot.id}>
                            <TableCell>{spot.name}</TableCell>

                            <TableCell>
                                <Badge
                                    variant={spot.active ? "default" : "secondary"}
                                >
                                    {spot.active ? "Ativa" : "Inativa"}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <SpotEditDialog
                                    spot={spot}
                                    onUpdated={() =>
                                        setSuccess("Mesa atualizada com sucesso!")
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}