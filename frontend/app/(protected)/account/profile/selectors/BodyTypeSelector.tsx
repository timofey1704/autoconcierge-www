import React from 'react'
import Selector, { Option as SelectorOption } from '@/components/ui/Selector'

export interface CarBodyType {
  id: number
  name: string
}

interface CarBodyTypeResponse {
  id: number
  name: string
  [key: string]: unknown
}

interface CarBodyTypeOption extends SelectorOption {
  label: string
}

interface CarBodyTypeChangeEvent {
  target: {
    id: string
    value: CarBodyType | null
    body_type: 'select'
  }
}

interface CarBodyTypeSelectorProps {
  name: string
  value: string | CarBodyType | null
  handleChange: (e: CarBodyTypeChangeEvent) => void
  label?: string
  tooltip?: string | React.ReactNode
  placeholder?: string
  isRequired?: boolean
}

const CarBodyTypeSelector: React.FC<CarBodyTypeSelectorProps> = ({
  name,
  value,
  handleChange,
  label,
  tooltip,
  placeholder,
  isRequired,
}) => {
  const mapCarTyCaroOption = (CarBodyType: CarBodyTypeResponse): CarBodyTypeOption => ({
    id: CarBodyType.id,
    value: CarBodyType.name,
    label: CarBodyType.name,
  })

  const transformSelectedValue = (option: CarBodyTypeOption | undefined): CarBodyType | null => {
    if (!option) return null
    return {
      id: option.id,
      name: option.value,
    }
  }

  const handleSelectorChange = (e: {
    target: {
      id: string
      value: SelectorOption | null
      selectedOption?: SelectorOption
    }
  }) => {
    const selectedOption = e.target.selectedOption as CarBodyTypeOption | undefined
    handleChange({
      target: {
        id: name,
        value: transformSelectedValue(selectedOption),
        body_type: 'select',
      },
    })
  }

  // преобразуем value в формат, понятный для Selector
  const selectorValue =
    typeof value === 'string'
      ? null
      : value
        ? {
            id: value.id,
            value: value.name,
            label: value.name,
          }
        : null

  return (
    <Selector<CarBodyTypeResponse>
      name={name}
      value={selectorValue}
      handleChange={handleSelectorChange}
      label={label}
      tooltip={tooltip}
      placeholder={placeholder}
      endpoint="/account/dictionaries/get-body-types/"
      mapDataToOptions={mapCarTyCaroOption}
      isRequired={isRequired}
    />
  )
}

export default CarBodyTypeSelector
