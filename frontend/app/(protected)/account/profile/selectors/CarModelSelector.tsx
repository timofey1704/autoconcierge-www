import React from 'react'
import Selector, { Option as SelectorOption } from '@/components/ui/Selector'

export interface CarModel {
  id: number
  name: string
  brand: number
}

interface CarModelResponse {
  id: number
  name: string
  [key: string]: unknown
}

interface CarModelOption extends SelectorOption {
  label: string
}

interface CarModelChangeEvent {
  target: {
    id: string
    value: CarModel | null
    model: 'select'
  }
}

interface CarModelSelectorProps {
  name: string
  value: string | CarModel | null
  handleChange: (e: CarModelChangeEvent) => void
  label?: string
  tooltip?: string | React.ReactNode
  brandId?: number | null
  placeholder?: string
  isRequired?: boolean
}

const CarModelSelector: React.FC<CarModelSelectorProps> = ({
  name,
  value,
  handleChange,
  label,
  brandId,
  tooltip,
  placeholder,
  isRequired,
}) => {
  const mapCarTyCaroOption = (CarModel: CarModelResponse): CarModelOption => ({
    id: CarModel.id,
    value: CarModel.name,
    label: CarModel.name,
  })

  const transformSelectedValue = (option: CarModelOption | undefined): CarModel | null => {
    if (!option) return null
    return {
      id: option.id,
      name: option.value,
      brand: brandId || 0,
    }
  }

  const handleSelectorChange = (e: {
    target: {
      id: string
      value: SelectorOption | null
      selectedOption?: SelectorOption
    }
  }) => {
    const selectedOption = e.target.selectedOption as CarModelOption | undefined
    handleChange({
      target: {
        id: name,
        value: transformSelectedValue(selectedOption),
        model: 'select',
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
    <Selector<CarModelResponse>
      name={name}
      value={selectorValue}
      handleChange={handleSelectorChange}
      label={label}
      tooltip={tooltip}
      placeholder={placeholder}
      endpoint={brandId ? `/account/dictionaries/get-models/` : undefined}
      mapDataToOptions={mapCarTyCaroOption}
      isRequired={isRequired}
      config={{
        params: {
          brand: brandId || undefined,
        },
        queryOptions: {
          enabled: !!brandId, // включаем запрос только если выбран бренд
        },
      }}
    />
  )
}

export default CarModelSelector
