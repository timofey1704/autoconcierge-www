'use client'

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { DataRow } from "../constants/statistics"
import { columns } from "./columns"

type Props = {
    data: DataRow[],
    total: number,
    page: number,
    pageSize: number,
    onPageChange: (page: number) => void
}

const StatisticsTable = ({data, total, page, pageSize, onPageChange}: Props) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(total / pageSize)
    });

    return (
        <div className="space-y-4">
            <div className="w-full overflow-x-auto">
                <table className="text-xs text-center border-collapse rounded-4">
                    <thead className="h-9 bg-black text-white">
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id}>
                                {hg.headers.map((header) => (
                                    <th key={header.id} className="py-2.5">
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="h-18 table-border">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="min-w-17 max-w-42.5 px-1 text-black">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-end gap-3">
                <p>1</p>
                <p>2</p>
                <p>3</p>
            </div>
        </div>
    )
}

export default StatisticsTable;