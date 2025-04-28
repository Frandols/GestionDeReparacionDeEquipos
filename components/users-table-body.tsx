'use client'

import { TableBody } from "./ui/table";
import UserRow, { UserRowData } from "./user-row";

interface UsersTableBodyProps {
    rows: UserRowData[]
    onChangeRow: (id: number, row: UserRowData) => void
}

export default function UsersTableBody({ rows, onChangeRow }: UsersTableBodyProps) {
    return <TableBody>
        {
            rows.map(
                (row, index) => (
                    <UserRow key={row.id} row={row} onChange={updatedRow => onChangeRow(index, updatedRow)} />
                )
            )
        }
    </TableBody>
}