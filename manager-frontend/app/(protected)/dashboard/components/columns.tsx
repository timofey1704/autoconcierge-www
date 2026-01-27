import { ColumnDef } from "@tanstack/react-table";
import { DataRow } from "../constants/statistics";

export const columns: ColumnDef<DataRow>[] = [
    {
        accessorKey: 'clientFio',
        header: 'ФИО клиента'
    },
    {
        accessorKey: 'servicePackage',
        header: 'Пакет услуг',
        cell: ({ getValue }) => (
            <span className="text-blue">
                { getValue<string>() }
            </span>
        )
    },
    {
        accessorKey: 'phone',
        header: 'Телефон'
    },
    {
        accessorKey: 'isActive',
        header: 'Состояние',
        cell: ({ getValue }) => (
            <span className={
                `px-2 py-[2px] border rounded-[90px] 
                ${getValue<boolean>() ? 
                'bg-success-secondary border-success-border text-success-main' : 
                'bg-danger-secondary border-danger-border text-danger-main'}`
            }>
                { getValue<boolean>() ? 'Активирован' : 'Не активирован' }
            </span>
        ),
    },
    {
        accessorKey: 'lastLogin',
        header: 'Дата входа'
    },
    // {
    //     accessorKey: 'managerFio',
    //     header: 'Менеджер'
    // },
    {
        accessorKey: 'company',
        header: 'Компания'
    },
    {
        accessorKey: 'department',
        header: 'Отделение'
    }
]