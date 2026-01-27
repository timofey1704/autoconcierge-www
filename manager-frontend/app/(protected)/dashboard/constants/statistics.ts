// Файл с тестовыми данными для таблицы, используется, пока не готов бэк

export type DataRow = {
    id: number,
    clientFio: string,
    servicePackage: string,
    phone: string,
    isActive: boolean,
    lastLogin: string,
    managerFio: string,
    company: string,
    department: string
}

const clientFios = ['Кбилцицхиашвили Магомед Абдурахмангаджиев', 'Христорождественская Анна Андреевна', 'Шемиот-Полочанский Анатолий Антонович']
const servicePackages = ['Light', 'Medium', 'Premium']
const phones = ['+375294899889', '+375292343443', '+375296565665']
const managerFios = ['Александров Александр Александрович', 'Иванов Иван Иванович']
const departments = ['Страхование жизни', 'Имущество', 'Смешанное']

const TEST_DATA: DataRow[] = Array.from({ length: 100 }).map((_, i) => ({
    id: i + 1,
    clientFio: clientFios[i % 3],
    servicePackage: servicePackages[i % 3],
    phone: phones[i % 3],
    isActive: i % 2 ? true : false,
    lastLogin: '26-01-26',
    managerFio: managerFios[i % 2],
    company: 'СБЛ Лизинг',
    department: departments[i % 3]
}))

export const GetStatisticsData = async (page: number, pageSize: number) => {
    // Возможно count вместо total

    // const data = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/account/dashboard/get-data?page=${page}&pageSize=${pageSize}`,
    //     {
    //         method: 'GET',
    //         credentials: 'include',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         }
    //     }
    // )

    // if (!data.ok) {
    //     throw new Error('Error while loading data')
    // }

    // return data.json();

    const data = [...TEST_DATA];

    const startPosition = (page - 1) * pageSize;
    const endPosition = startPosition + pageSize;

    return {
        data: data.slice(startPosition, endPosition),
        total: data.length
    }
}