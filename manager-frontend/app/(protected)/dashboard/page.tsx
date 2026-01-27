'use client'

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react'
import { GetStatisticsData } from './constants/statistics';
import Loader from '@/components/ui/Loader';
import StatisticsTable from './components/StatisticsTable';
import UTextInput from '@/components/ui/UTextInput';
import { useSession } from 'next-auth/react';

const TABLE_PAGE_SIZE = 7;

const StatisticsPage = () => {
  const { data: session } = useSession();

  const [tablePage, setTablePage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['statistics', tablePage],
    queryFn: async () => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/account/dashboard/get-data?page=${tablePage}&pageSize=${TABLE_PAGE_SIZE}`, 
        {
          method: 'GET',
          headers,
          credentials: 'include'
        }    
      )

      if (!response.ok) {
        throw new Error("Error while trying to load data")
      }

      const data = await response.json();
      return data;

      GetStatisticsData(tablePage, TABLE_PAGE_SIZE)
    },
    //queryFn: () => GetStatisticsData(tablePage, TABLE_PAGE_SIZE),
    placeholderData: (prev) => prev
  })

  if (isLoading || !data) {
    return <Loader/>
  }

  if (!data.length) {
    return (
      <h5>Данных пока нет</h5>
    )
  }

  return(
    <div>
      <h4 className="w-fit text-black">Статистика</h4>

      <div className="pt-5 xl:pt-10">
        <div className="w-full flex items-center justify-between pb-2.5">
          <div>
            Фильтр
          </div>
          <UTextInput
            name="search"
            value={''}
            placeholder="Поиск"
            className="w-80 h-11"
          />
        </div>
        <StatisticsTable 
          data={data.data}
          total={data.total}
          page={tablePage}
          pageSize={TABLE_PAGE_SIZE}
          onPageChange={setTablePage}
        />
      </div>
    </div>
  )
}

export default StatisticsPage
