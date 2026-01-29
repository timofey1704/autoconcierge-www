'use client'

import { useState } from 'react'
import { DashboardResponse } from './constants/statistics'
import Loader from '@/components/ui/Loader'
import StatisticsTable from './components/StatisticsTable'
import UTextInput from '@/components/ui/UTextInput'
import SearchIcon from '../../../public/icons/search.svg'
import Image from 'next/image'
import { useDebounce } from '@/app/hooks/useDebounce'
import UMultiSelect from '@/components/ui/UMultiSelect'
import { membershipTypes, statusTypes } from '@/app/constants/multiselectOptions'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import ClearFiltersIcon from '../../../public/icons/clearFilters.svg'
import UButton from '@/components/ui/UButton'

const TABLE_PAGE_SIZE = 7

type MembershipValue = (typeof membershipTypes)[number]['value']
type StatusValue = (typeof statusTypes)[number]['value']

const StatisticsPage = () => {
  const [membership, setMembership] = useState<MembershipValue[]>([])
  const [status, setStatus] = useState<StatusValue[]>([])
  const [search, setSearch] = useState('')
  const [tablePage, setTablePage] = useState(1)

  const debouncedSearch = useDebounce(search, 400)

  // Преобразуем значения фильтров для бекенда
  const membershipTypeParam = membership.length > 0 ? membership.join(',') : undefined
  const isActiveParam = status.length === 1 ? String(status[0]) : undefined

  // Обработчики изменения фильтров с автоматическим сбросом страницы
  const handleMembershipChange = (value: MembershipValue[]) => {
    setMembership(value)
    setTablePage(1)
  }

  const handleStatusChange = (value: StatusValue[]) => {
    setStatus(value)
    setTablePage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setTablePage(1)
  }

  // useClientFetch автоматически добавит query параметры через axios
  const { data, isLoading, error } = useClientFetch<DashboardResponse>(
    '/account/dashboard/get-data',
    {
      method: 'GET',
      config: {
        params: {
          membership_type: membershipTypeParam,
          is_active: isActiveParam,
          search: debouncedSearch,
          sort_by: 'last_activity',
          sort_order: 'desc',
          page: tablePage,
          page_size: TABLE_PAGE_SIZE,
        },
      },
      queryOptions: {
        placeholderData: prev => prev,
      },
    }
  )

  if (isLoading || !data) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="text-red-600">
        <h5>Ошибка при загрузке данных</h5>
        <p>{error instanceof Error ? error.message : 'Неизвестная ошибка'}</p>
      </div>
    )
  }

  if (!data.data || data.data.length === 0) {
    return (
      <div>
        <h4 className="w-fit text-black">Статистика</h4>
        <div className="pt-5 xl:pt-10">
          <div className="flex w-full flex-wrap items-center justify-between gap-5 pb-2.5">
            <div className="flex flex-wrap items-center gap-5 lg:flex-nowrap">
              <UMultiSelect<MembershipValue>
                name="membership"
                value={membership}
                handleChange={handleMembershipChange}
                options={membershipTypes}
                placeholder="Тип пакета услуг"
                className="w-full max-w-80 min-w-50 lg:max-w-70"
              />
              <UMultiSelect<StatusValue>
                name="status"
                value={status}
                handleChange={handleStatusChange}
                options={statusTypes}
                placeholder="Статус активации"
                className="w-full max-w-80 min-w-50 lg:max-w-70"
              />
            </div>
            <UTextInput
              name="search"
              value={search}
              handleChange={handleSearchChange}
              icon={<Image src={SearchIcon} width={15} height={15} alt={''} />}
              placeholder="Поиск"
              className="h-11 w-80"
            />
          </div>
          <h5 className="pt-5">Данных пока нет</h5>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h4 className="w-fit text-black">Статистика</h4>

      <div className="pt-5 xl:pt-10">
        <div className="flex w-full flex-wrap items-center justify-between gap-5 pb-2.5">
          <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
            <UMultiSelect<MembershipValue>
              name="membership"
              value={membership}
              handleChange={setMembership}
              options={membershipTypes}
              placeholder="Тип пакета услуг"
              className="w-full max-w-80 min-w-50 lg:max-w-70"
            />
            <UMultiSelect<StatusValue>
              name="status"
              value={status}
              handleChange={setStatus}
              options={statusTypes}
              placeholder="Статус активации"
              className="w-full max-w-80 min-w-50 lg:max-w-70"
            />
            <UButton
              type="button"
              onClick={() => {
                setMembership([]);
                setStatus([]);
                setTablePage(1);
              }}
              midIcon={<Image src={ClearFiltersIcon} width={60} height={60} alt={''} />}
              className="w-auto h-auto py-2 border-none outline-none"
            />
          </div>
          <UTextInput
            name="search"
            value={search}
            handleChange={e => setSearch(e.target.value)}
            icon={<Image src={SearchIcon} width={15} height={15} alt={''} />}
            placeholder="Поиск"
            className="h-11 w-80"
          />
        </div>
        <StatisticsTable
          data={data.data}
          total={data.count}
          page={tablePage}
          pageSize={TABLE_PAGE_SIZE}
          onPageChange={setTablePage}
        />
      </div>
    </div>
  )
}

export default StatisticsPage
