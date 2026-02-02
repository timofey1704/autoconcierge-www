import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Dialog } from '@/components/ui/Dialog'
import { useForm } from '@/app/hooks/useForm'
import { Car } from '@/app/types'
import showToast from '@/components/ui/showToast'
import { getProxiedImageUrl } from '@/lib/utils/imageProxy'
import CarBrandSelector, { CarBrand } from '../selectors/CarBrandSelector'
import CarModelSelector, { CarModel } from '../selectors/CarModelSelector'
import CarBodyTypeSelector, { CarBodyType } from '../selectors/BodyTypeSelector'
import ColorSelector, { CarColor } from '../selectors/ColorSelector'
import YearSelector from '../selectors/YearSelector'
import UTextInput from '@/components/ui/UTextInput'

interface EditPopupProps {
  car: Car
  onClose: () => void
  onSuccess: () => void
}

const validationRules = {
  brand: { required: true },
  model: { required: true },
  body_type: { required: true },
  year_built: { required: true },
  color: { required: true },
  licence_plate: { required: true },
}

const EditPopup = ({ car, onClose, onSuccess }: EditPopupProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(getProxiedImageUrl(car.image) || '')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { values, handleChange, handleSubmit, FormProvider } = useForm(
    {
      imageURL: '',
      brand: { id: car.brand_id, name: car.brand } as CarBrand,
      model: { id: car.model_id, name: car.model } as CarModel,
      body_type: { id: car.body_type_id, name: car.body_type } as CarBodyType,
      year_built: car.year_built.toString(),
      color: { id: car.color_id, name: car.color } as CarColor,
      licence_plate: car.licence_plate,
    },
    validationRules,
    async values => {
      try {
        const formData = new FormData()

        // добавляем ID автомобиля
        formData.append('id', car.id.toString())

        // добавляем все поля
        Object.entries(values).forEach(([key, value]) => {
          if (key !== 'imageURL') {
            // для полей с id отправляем только id
            if (
              ['brand', 'model', 'body_type', 'color'].includes(key) &&
              value &&
              typeof value === 'object' &&
              'id' in value
            ) {
              formData.append(key, value.id.toString())
            } else {
              formData.append(key, value?.toString() || '')
            }
          }
        })

        // если есть файл для загрузки, добавляем его
        if (selectedFile) {
          formData.append('image', selectedFile)
        }

        const response = await fetch('/api/account/profile/cars/edit', {
          method: 'PATCH',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Ошибка при обновлении автомобиля')
        }

        onSuccess()
      } catch (error) {
        showToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Ой, что то пошло не так..',
        })
      }
    }
  )

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast({ type: 'error', message: 'Пожалуйста, выберите изображение' })
      return
    }

    setSelectedFile(file)
    const localPreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(localPreviewUrl)

    handleChange({
      target: { id: 'imageURL', value: file.name },
    })

    e.target.value = ''
  }

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      title={`Редактировать ${car.brand} ${car.model}`}
      description={
        <FormProvider>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <div
                className="group relative w-40 cursor-pointer transition-opacity hover:opacity-80"
                onClick={openFileDialog}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && openFileDialog()}
              >
                <input
                  type="file"
                  id="image"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <Image
                  src={previewUrl || '/images/no-car.svg'}
                  alt="Car"
                  height={160}
                  width={160}
                  className="aspect-square rounded-2xl object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CarBrandSelector
                name="brand"
                value={values.brand}
                handleChange={handleChange}
                label="Марка"
                placeholder="Выберите марку автомобиля"
              />

              <CarModelSelector
                name="model"
                value={values.model}
                handleChange={handleChange}
                label="Модель"
                placeholder="Выберите модель автомобиля"
              />

              <CarBodyTypeSelector
                name="body_type"
                value={values.body_type}
                handleChange={handleChange}
                label="Кузов"
                placeholder="Выберите кузов автомобиля"
              />

              <YearSelector
                name="year_built"
                value={values.year_built}
                handleChange={handleChange}
                label="Год выпуска"
                placeholder="Выберите год выпуска автомобиля"
              />

              <ColorSelector
                name="color"
                value={values.color}
                handleChange={handleChange}
                label="Цвет"
                placeholder="Выберите цвет автомобиля"
              />

              <UTextInput
                name="licence_plate"
                value={values.licence_plate}
                handleChange={handleChange}
                label="Номерной знак"
                placeholder="Введите госномер автомобиля"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 text-base font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-linear-to-r from-[#2A00D3] to-blue-700 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-[#2A00D3] hover:to-blue-800 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
              >
                Сохранить
              </button>
            </div>
          </form>
        </FormProvider>
      }
      showSubmit={false}
      showCancel={false}
    />
  )
}

export default EditPopup
