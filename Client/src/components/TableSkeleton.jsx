"use client"

import { Skeleton } from "./ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table"

export function TableSkeleton({ columns = 5, rows = 5 }) {
    return (
        <div className="rounded-xl border bg-card/50 overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/40">
                    <TableRow>
                        {Array.from({ length: columns }).map((_, i) => (
                            <TableHead key={i} className="py-4">
                                <Skeleton className="h-4 w-20" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <TableCell key={colIndex} className="py-4">
                                    <Skeleton className="h-4 w-full max-w-[120px]" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
