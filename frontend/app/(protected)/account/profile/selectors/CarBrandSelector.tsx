import React from 'react'
import Selector, { Option as SelectorOption } from '@/components/ui/Selector'

export interface CarBrand {
  id: number
  name: string
}

interface CarBrandResponse {
  id: number
  name: string
  [key: string]: unknown
}

interface CarBrandOption extends SelectorOption {
  label: string
}

interface CarBrandChangeEvent {
  target: {
    id: string
    value: CarBrand | null
    brand: 'select'
  }
}

interface CarBrandSelectorProps {
  name: string
  value: string | CarBrand | null
  handleChange: (e: CarBrandChangeEvent) => void
  label?: string
  tooltip?: string | React.ReactNode
  placeholder?: string
  isRequired?: boolean
}

const CarBrandSelector: React.FC<CarBrandSelectorProps> = ({
  name,
  value,
  handleChange,
  label,
  tooltip,
  placeholder,
  isRequired,
}) => {
  const mapCarTyCaroOption = (CarBrand: CarBrandResponse): CarBrandOption => ({
    id: CarBrand.id,
    value: CarBrand.name,
    label: CarBrand.name,
  })

  const transformSelectedValue = (option: CarBrandOption | undefined): CarBrand | null => {
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
    const selectedOption = e.target.selectedOption as CarBrandOption | undefined
    handleChange({
      target: {
        id: name,
        value: transformSelectedValue(selectedOption),
        brand: 'select',
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
    <Selector<CarBrandResponse>
      name={name}
      value={selectorValue}
      handleChange={handleSelectorChange}
      label={label}
      tooltip={tooltip}
      placeholder={placeholder}
      endpoint="/account/dictionaries/get-brands/"
      mapDataToOptions={mapCarTyCaroOption}
      isRequired={isRequired}
    />
  )
}

export default CarBrandSelector
