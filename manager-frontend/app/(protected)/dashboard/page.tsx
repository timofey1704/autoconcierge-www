'use client'

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react'
import { GetStatisticsData } from './constants/statistics';
import Loader from '@/components/ui/Loader';
import StatisticsTable from './components/StatisticsTable';
import UTextInput from '@/components/ui/UTextInput';
import { useSession } from 'next-auth/react';
import SearchIcon from '../../../public/icons/search.svg'
import Image from 'next/image';
import { useDebounce } from '@/app/hooks/useDebounce';
import UMultiSelect from '@/components/ui/UMultiSelect';
import { membershipTypes, statusTypes } from '@/app/constants/multiselectOptions';
import { SelectOption } from '@/app/types';

const TABLE_PAGE_SIZE = 7;

type MembershipValue = typeof membershipTypes[number]['value'];
type StatusValue = typeof statusTypes[number]['value'];

const StatisticsPage = () => {
  const { data: session } = useSession();

  const [membership, setMembership] = useState<MembershipValue[]>([]);
  const [status, setStatus] = useState<StatusValue[]>([]);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const [tablePage, setTablePage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['statistics', tablePage],
    // queryFn: async () => {
    //   const headers: Record<string, string> = {
    //     'Content-Type': 'application/json',
    //     ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
    //   };

    //   const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/account/dashboard/get-data?page=${tablePage}&pageSize=${TABLE_PAGE_SIZE}`, 
    //     {
    //       method: 'GET',
    //       headers,
    //       credentials: 'include'
    //     }    
    //   )

    //   if (!response.ok) {
    //     throw new Error("Error while trying to load data")
    //   }

    //   const data = await response.json();
    //   return data;
    // },
    queryFn: () => GetStatisticsData(tablePage, TABLE_PAGE_SIZE),
    placeholderData: (prev) => prev
  })

  if (isLoading || !data) {
    return <Loader/>
  }

  // if (!data.length) {
  //   return (
  //     <h5>Данных пока нет</h5>
  //   )
  // }

  return(
    <div>
      <h4 className="w-fit text-black">Статистика</h4>

      <div className="pt-5 xl:pt-10">
        <div className="w-full flex flex-wrap items-center justify-between gap-5 pb-2.5">
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-5">
            <UMultiSelect<MembershipValue> 
              name="membership"
              value={membership}
              handleChange={setMembership}
              options={membershipTypes}
              placeholder="Тип пакета услуг"
              className="w-full min-w-50 max-w-80 lg:max-w-70"
            />
            <UMultiSelect<StatusValue> 
              name="status"
              value={status}
              handleChange={setStatus}
              options={statusTypes}
              placeholder="Статус активации"
              className="w-full min-w-50 max-w-80 lg:max-w-70"
            />
          </div>
          <UTextInput
            name="search"
            value={search}
            handleChange={(e) => setSearch(e.target.value)}
            icon={<Image src={SearchIcon} width={15} height={15} alt={''}/>}
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
