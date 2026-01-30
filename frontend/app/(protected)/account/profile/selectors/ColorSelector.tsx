import React from 'react'
import Selector, { Option } from '@/components/ui/Selector'

export interface CarColor {
  id: number
  name: string
  hex_code: string
}

interface ColorResponse {
  id: number
  name: string
  hex_code: string
  [key: string]: unknown
}

interface ColorChangeEvent {
  target: {
    id: string
    value: CarColor | null
    type: 'select'
  }
}

interface ColorSelectorProps {
  name: string
  value: string | CarColor | null
  handleChange: (e: ColorChangeEvent) => void
  label?: string
  tooltip?: string | React.ReactNode
  placeholder?: string
  isRequired?: boolean
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  name,
  value,
  handleChange,
  label,
  tooltip,
  placeholder,
  isRequired,
}) => {
  const mapColorToOption = (color: ColorResponse): Option => ({
    id: color.id,
    value: color.name,
    label: (
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color.hex_code }} />
        <span>{color.name}</span>
      </div>
    ),
  })

  const transformSelectedValue = (option: Option | undefined): CarColor | null => {
    if (!option) return null
    return {
      id: option.id,
      name: option.value,
      hex_code: '',
    }
  }

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
        value: transformSelectedValue(selectedOption),
        type: 'select',
      },
    })
  }

  const selectorValue =
    typeof value === 'string' || !value
      ? null
      : {
          id: value.id,
          value: value.name,
          label: (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: value.hex_code }} />
              <span>{value.name}</span>
            </div>
          ),
        }

  return (
    <Selector<ColorResponse>
      name={name}
      value={selectorValue}
      handleChange={handleSelectorChange}
      label={label}
      tooltip={tooltip}
      placeholder={placeholder}
      endpoint="/account/dictionaries/get-colors/"
      mapDataToOptions={mapColorToOption}
      isRequired={isRequired}
    />
  )
}

export default ColorSelector
