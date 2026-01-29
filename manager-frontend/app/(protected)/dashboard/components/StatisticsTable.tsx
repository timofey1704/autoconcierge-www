'use client'

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { DataRow } from '../constants/statistics'
import { columns } from './columns'

type Props = {
  data: DataRow[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
}

const StatisticsTable = ({ data, total, page, pageSize, onPageChange }: Props) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
  })

  const totalPages = Math.ceil(total / pageSize)

  const getPages = () => {
    const pages: (number | string)[] = []
    const totalVisible = 3

    if (totalPages <= totalVisible * 2 + 1) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    for (let i = 1; i <= totalVisible; i++) pages.push(i)

    const middleStart = Math.max(totalVisible + 1, page - 1)
    const middleEnd = Math.min(totalPages - totalVisible, page + 1)

    if (middleStart > totalVisible + 1) pages.push('...')

    for (let i = middleStart; i <= middleEnd; i++) {
      pages.push(i)
    }

    if (middleEnd < totalPages - totalVisible) pages.push('...')

    for (let i = totalPages - totalVisible + 1; i <= totalPages; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto rounded-2xl xl:w-fit">
        <table className="rounded-4 border-collapse text-center text-xs">
          <thead className="h-9 bg-black text-white">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th key={header.id} className="py-2.5">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="table-border h-18">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="min-w-30 px-1">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="h-18">
              <td colSpan={table.getAllColumns().length}>
                <div className="flex items-center justify-end gap-3 text-black">
                  {getPages().map((p, i) =>
                    p === '...' ? (
                      <span key={i}>...</span>
                    ) : (
                      <button
                        key={i}
                        onClick={() => onPageChange(Number(p))}
                        className={`${page === p ? 'text-blue text-sm font-bold transition' : 'hover:text-blue'}`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* <div className="flex items-center justify-end gap-3 text-black">
                <p>1</p>
                <p>2</p>
                <p>3</p>
            </div> */}
    </div>
  )
}

export default StatisticsTable
