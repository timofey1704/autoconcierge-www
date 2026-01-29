'use client'

import { MultiSelectProps } from "@/app/types"
import Select from "react-select"

const UMultiSelect = <T,>({
  value,
  handleChange,
  label,
  placeholder,
  name,
  options,
  className = '',
  noOptionsMessage = 'Нет доступных опций',
}: MultiSelectProps<T>) => {  
  return (
    <div className={className}>
      {label && <label className="my-2 block text-sm font-medium text-gray-500">{label}</label>}
      <Select
        isMulti
        name={name}
        id={name}
        options={options}
        value={options.filter(option => value.includes(option.value))}
        onChange={selectedOptions => {
          handleChange(selectedOptions.map(o => o.value))
        }}
        getOptionValue={option => String(option.value)}
        className="rounded-lg"
        classNamePrefix="select"
        placeholder={placeholder}
        noOptionsMessage={() => noOptionsMessage}
        styles={{
          control: base => ({
            ...base,
            borderRadius: '0.75rem',
            backgroundColor: '#F3F4F6',
            border: '1px solid #E5E7EB',
            padding: '2px',
            '&:hover': {
              borderColor: '#E5E7EB',
            },
            '&:focus-within': {
              backgroundColor: '#FFFFFF',
              borderColor: '#E5E7EB',
              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
            },
          }),
          menu: base => ({
            ...base,
            position: 'absolute',
            width: '100%',
            zIndex: 9999,
            marginTop: '4px',
            borderRadius: '0.75rem',
            overflow: 'hidden',
          }),
          menuList: base => ({
            ...base,
            padding: '4px',
          }),
          multiValue: base => ({
            ...base,
            backgroundColor: '#EFF6FF',
            borderRadius: '0.5rem',
          }),
          multiValueLabel: base => ({
            ...base,
            color: 'var(--color-gray-500)',
          }),
          multiValueRemove: base => ({
            ...base,
            color: 'var(--color-blue)',
            ':hover': {
              backgroundColor: '#DBEAFE',
              color: 'var(--color-blue)',
            },
          }),
          menuPortal: base => ({
            ...base,
            zIndex: 9999,
          }),
          option: (base, state) => ({
            ...base,
            fontSize: '0.875rem',
            padding: '8px 12px',
            backgroundColor: state.isSelected ? '#EFF6FF' : state.isFocused ? '#F3F4F6' : 'white',
            color: state.isSelected ? '#2563EB' : '#1F2937',
            cursor: 'pointer',
            '&:active': {
              backgroundColor: '#DBEAFE',
            },
            '&:hover': {
              backgroundColor: state.isSelected ? '#EFF6FF' : '#F3F4F6',
            },
          }),
        }}
      />
    </div>
  )
}

export default UMultiSelect
