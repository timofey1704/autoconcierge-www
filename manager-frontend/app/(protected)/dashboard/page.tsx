'use client'

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react'
import { GetStatisticsData } from './constants/statistics';
import Loader from '@/components/ui/Loader';
import StatisticsTable from './components/StatisticsTable';

const TABLE_PAGE_SIZE = 7;

const StatisticsPage = () => {
  const [tablePage, setTablePage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['statistics', tablePage],
    queryFn: () => GetStatisticsData(tablePage, TABLE_PAGE_SIZE)
  })

  if (isLoading || !data) {
    return <Loader/>
  }

  return(
    <div>
      <h4 className="w-fit text-black">Статистика</h4>

      <div className="pt-5 xl:pt-10">
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
