import { ColumnDef } from "@tanstack/react-table";
import { DataRow } from "../constants/statistics";

export const columns: ColumnDef<DataRow>[] = [
    {
        accessorKey: 'clientFio',
        header: 'ФИО клиента'
    },
    {
        accessorKey: 'servicePackage',
        header: 'Пакет услуг'
    },
    {
        accessorKey: 'phone',
        header: 'Телефон'
    },
    {
        accessorKey: 'isActive',
        header: 'Состояние',
        cell: ({ getValue }) => (
            <span className={ getValue<boolean>() ? 'text-green' : 'text-red' }>
                { getValue<boolean>() ? 'Активирован' : 'Не активирован' }
            </span>
        ),
    },
    {
        accessorKey: 'lastLogin',
        header: 'Дата входа'
    },
    {
        accessorKey: 'managerFio',
        header: 'Менеджер'
    },
    {
        accessorKey: 'company',
        header: 'Компания'
    },
    {
        accessorKey: 'department',
        header: 'Отделение'
    }
]