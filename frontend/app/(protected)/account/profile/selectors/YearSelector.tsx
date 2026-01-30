import React from 'react'
import Selector, { Option } from '@/components/ui/Selector'

export interface Year {
  id: number
  value: string
  label: string
  [key: string]: unknown
}

interface YearChangeEvent {
  target: {
    id: string
    value: string
    selectedOption?: Option
  }
}

interface YearSelectorProps {
  name: string
  value: string
  handleChange: (e: YearChangeEvent) => void
  label?: string
  tooltip?: string | React.ReactNode
  placeholder?: string
  isRequired?: boolean
}

//1980-2026
const YEARS: Year[] = Array.from({ length: 47 }, (_, i) => {
  const year = 1980 + i
  return {
    id: i + 1,
    value: year.toString(),
    label: year.toString(),
  }
})

const YearSelector: React.FC<YearSelectorProps> = ({
  name,
  value,
  handleChange,
  label,
  tooltip,
  placeholder,
  isRequired,
}) => {
  const handleSelectorChange = (e: {
    target: {
      id: string
      value: Option | null
      selectedOption?: Option
    }
  }) => {
    const selectedOption = e.target.selectedOption
    handleChange({
      target: {
        id: name,
        value: selectedOption?.value || '',
        selectedOption,
      },
    })
  }

  // находим текущее значение в списке для отображения
  const currentValue = YEARS.find(year => year.value === value)

  return (
    <Selector<Year>
      name={name}
      value={currentValue}
      handleChange={handleSelectorChange}
      label={label}
      tooltip={tooltip}
      placeholder={placeholder}
      mapDataToOptions={gender => ({
        id: gender.id,
        value: gender.value,
        label: gender.label,
      })}
      staticOptions={YEARS}
      isRequired={isRequired}
    />
  )
}

export default YearSelector
