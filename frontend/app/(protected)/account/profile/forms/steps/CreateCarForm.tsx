import React, { useRef, useState, useEffect } from 'react'
import { useForm } from '@/app/hooks/useForm'
import UTextInput from '@/components/ui/UTextInput'
import showToast from '@/components/ui/showToast'
import Image from 'next/image'
// import PetTypeSelector, { PetType } from '@/components/selectors/PetTypeSelector'
// import GenderSelector from '@/components/selectors/GenderSelector'
// import BreedSelector, { Breed } from '@/components/selectors/BreedSelector'
// import ColorSelector, { PetColor } from '@/components/selectors/ColorSelector'

const validationRules = {
  imageURL: { required: false },
  name: { required: true },
  type: { required: true },
  birthday: { required: true },
  gender: { required: true },
  breed: { required: true },
  color: { required: true },
  comment: { required: false },
  allergies: { required: false },
}

export type PetImageResponse = {
  imageUrl: string
  message: string
}

interface QRCodeData {
  code: string
  imageURL: string
}

interface CreatePetFormProps {
  onClose: () => void
  initialQRData: QRCodeData | null
}

const CreateCarForm: React.FC<CreatePetFormProps> = ({ onClose, initialQRData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { values, handleChange, handleSubmit, FormProvider } = useForm(
    {
      imageURL: '',
      name: '',
      // type: null as CarType | null,
      birthday: '',
      gender: '',
      // breed: null as Breed | null,
      // color: null as CarColor | null,
      comment: '',
      allergies: '',
      QRImage: initialQRData?.imageURL || '',
      QRCode: initialQRData?.code || '',
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

        //   // добавляем все текстовые поля
        //   Object.entries(values).forEach(([key, value]) => {
        //     if (!['imageURL', 'QRImage', 'QRCode'].includes(key)) {
        //       // для полей с id отправляем только id
        //       if (
        //         ['type', 'breed', 'color'].includes(key) &&
        //         value &&
        //         typeof value === 'object' &&
        //         'id' in value
        //       ) {
        //         formData.append(key, value.id.toString())
        //       } else {
        //         formData.append(key, value?.toString() || '')
        //       }
        //     }
        //   }
        // )

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

        showToast({ type: 'success', message: 'Питомец успешно добавлен!' })
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
        <div className="overflow-hidden rounded-2xl pl-1">
          <div className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex items-center justify-around gap-4 py-4">
                <div className="flex items-center justify-center md:w-40">
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
                      src={previewUrl || '/images/noPet.svg'}
                      alt="Pet"
                      height={160}
                      width={160}
                      priority
                      className="aspect-square w-full rounded-2xl object-cover md:w-40"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={values.QRImage || '/images/noQR.svg'}
                    alt="qrcode"
                    width={160}
                    height={160}
                    className="rounded-2xl object-contain"
                  />
                  {values.QRCode && (
                    <div className="flex items-center justify-center rounded-lg bg-white px-12 py-2">
                      <span className="font-mono text-lg font-semibold text-gray-700">
                        {values.QRCode}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="h-0,5 w-full bg-white" />
              <div className="grid grid-cols-1 gap-6 px-0.5 pb-4 md:grid-cols-3">
                <UTextInput
                  name="name"
                  value={values.name}
                  handleChange={handleChange}
                  label="Кличка"
                  placeholder="Как зовут вашего питомца?"
                />
                {/* <PetTypeSelector
                  name="type"
                  value={values.type}
                  handleChange={handleChange}
                  label="Вид"
                  placeholder="Какой у вас питомец?"
                /> */}
                <UTextInput
                  name="birthday"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  min={
                    new Date(new Date().setFullYear(new Date().getFullYear() - 15))
                      .toISOString()
                      .split('T')[0]
                  }
                  value={values.birthday}
                  handleChange={handleChange}
                  label="Дата рождения"
                />
                {/* <GenderSelector
                  name="gender"
                  value={values.gender}
                  handleChange={handleChange}
                  label="Пол"
                  placeholder="Выберите пол питомца"
                />
                <BreedSelector
                  name="breed"
                  value={values.breed}
                  petTypeId={values.type?.id}
                  handleChange={handleChange}
                  label="Порода"
                  placeholder="Выберите породу питомца"
                />
                <ColorSelector
                  name="color"
                  value={values.color}
                  handleChange={handleChange}
                  label="Цвет"
                  placeholder="Выберите цвет питомца"
                /> */}
              </div>

              <div className="flex items-center justify-center">
                <button className="my-7 w-full rounded-xl bg-linear-to-r from-[#2A00D3] to-blue-700 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:cursor-pointer hover:from-[#2A00D3] hover:to-blue-800 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98]">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

export default CreateCarForm
