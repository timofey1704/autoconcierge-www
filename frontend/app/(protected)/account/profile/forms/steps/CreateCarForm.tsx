import React, { useRef, useState, useEffect } from 'react'
import { useForm } from '@/app/hooks/useForm'
import UTextInput from '@/components/ui/UTextInput'
import showToast from '@/components/ui/showToast'
import Image from 'next/image'
import { getProxiedImageUrl } from '@/lib/utils/imageProxy'
import { QRCodeData } from '@/app/types'
import CarBrandSelector, { CarBrand } from '../../selectors/CarBrandSelector'
import CarModelSelector, { CarModel } from '../../selectors/CarModelSelector'
import CarBodyTypeSelector, { CarBodyType } from '../../selectors/BodyTypeSelector'
import ColorSelector, { CarColor } from '../../selectors/ColorSelector'
import YearSelector from '../../selectors/YearSelector'

const validationRules = {
  imageURL: { required: false },
  brand: { required: true },
  model: { required: true },
  body_type: { required: true },
  year_built: { required: true },
  color: { required: true },
  vin_code: { required: true },
  licence_plate: { required: true },
}

interface CreateCarFormProps {
  onClose: () => void
  initialQRData: QRCodeData | null
}

const CreateCarForm: React.FC<CreateCarFormProps> = ({ onClose, initialQRData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { values, handleChange, handleSubmit, FormProvider } = useForm(
    {
      imageURL: '',
      brand: null as CarBrand | null,
      model: null as CarModel | null,
      body_type: null as CarBodyType | null,
      year_built: '',
      color: null as CarColor | null,
      vin_code: '',
      licence_plate: '',
      QRImage: initialQRData?.imageURL || '',
      QRCode: initialQRData?.code || '',
      listing_company: initialQRData?.listing_company || '',
    },
    validationRules,
    async values => {
      try {
        // создаем FormData для отправки файла и данных формы
        const formData = new FormData()

        // добавляем код QR для связывания с существующей записью
        if (initialQRData?.code) {
          formData.append('qr_code', initialQRData.code)
        }

        // !lising_company берется автоматически из QR кода на бекенде

        // добавляем все текстовые поля
        Object.entries(values).forEach(([key, value]) => {
          if (!['imageURL', 'QRImage', 'QRCode', 'listing_company'].includes(key)) {
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
        } else {
          console.log('No file found in selectedFile state')
        }

        const response = await fetch('/api/account/profile/cars', {
          method: 'POST',
          body: formData, // FormData автоматически установит правильный Content-Type
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Ошибка при обновлении данных')
        }

        const data = await response.json()

        // обновляем значения QR кода в форме
        if (data.qr_code) {
          handleChange({
            target: {
              id: 'QRImage',
              value: data.qr_code.imageURL,
            },
          })
          handleChange({
            target: {
              id: 'QRCode',
              value: data.qr_code.code,
            },
          })
        }

        showToast({ type: 'success', message: 'Автомобиль успешно добавлен!' })
        onClose()
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

    // cохраняем файл в стейте
    setSelectedFile(file)

    const localPreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(localPreviewUrl)

    // сохраняем только локальное значение (файл уйдет вместе с формой)
    handleChange({
      target: { id: 'imageURL', value: file.name }, // можно просто имя файла или пустую строку
    })

    e.target.value = ''
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <FormProvider>
      <div className="space-y-3 py-3">
        <div className="overflow-visible rounded-2xl md:pl-1">
          <div className="space-y-4">
            <form className="flex flex-col md:flex-row md:space-x-6" onSubmit={handleSubmit}>
              <div className="mb-6 flex shrink-0 flex-row items-center justify-center gap-3 py-4 md:mb-0 md:flex-col md:justify-around md:gap-4">
                <div className="flex w-40 items-center justify-center">
                  <div
                    className="group relative w-full cursor-pointer transition-opacity hover:opacity-80"
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
                      priority
                      className="aspect-square rounded-2xl object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 md:gap-2">
                  <Image
                    src={getProxiedImageUrl(values.QRImage) || '/images/noQR.svg'}
                    alt="qrcode"
                    width={102}
                    height={102}
                    className="h-24 w-24 rounded-2xl object-contain md:h-25.5 md:w-25.5"
                  />
                  {values.QRCode && (
                    <div className="flex items-center justify-center rounded-lg bg-white px-5 py-2">
                      <span className="font-mono text-[12px] font-semibold text-gray-700">
                        {values.QRCode}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid flex-1 grid-cols-1 gap-6 pb-4 md:grid-cols-2 md:px-0.5">
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
                  brandId={values.brand?.id}
                />

                <CarBodyTypeSelector
                  name="body_type"
                  value={values.body_type}
                  handleChange={handleChange}
                  label="Кузов"
                  placeholder="Выберите кузов автомобиля"
                  modelId={values.model?.id}
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
                  name="vin_code"
                  value={values.vin_code}
                  handleChange={handleChange}
                  label="VIN код"
                  placeholder="Введите VIN код автомобиля"
                />
                <UTextInput
                  name="licence_plate"
                  value={values.licence_plate}
                  handleChange={handleChange}
                  label="Номерной знак"
                  placeholder="Введите госномер автомобиля"
                />
                <UTextInput
                  name="listing_company"
                  value={values.listing_company}
                  handleChange={handleChange}
                  label="Лизинговая компания"
                  disabled={true}
                />
              </div>
            </form>
            <div className="w-full text-right">
              <a
                className="cursor-pointer hover:text-blue-700 underline"
                href="https://tawk.to/chat/6989e074d41d8f1c3889ef8c/1jh199iqm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Моего автомобиля нет в списке"
              >Моего автомобиля нет в списке</a>
            </div>
            <div className="w-full md:px-0.5">
              <button
                onClick={handleSubmit}
                className="w-full rounded-xl bg-linear-to-r from-[#2A00D3] to-blue-700 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:cursor-pointer hover:from-[#2A00D3] hover:to-blue-800 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

export default CreateCarForm
