import TowTruckIcon from '@/public/icons/services/TowTruck.svg'
import TaxiIcon from '@/public/icons/services/Taxi.svg'
import AutopsyIcon from '@/public/icons/services/Autopsy.svg'
import WheelIcon from '@/public/icons/services/Wheel.svg'
import EngineStartingIcon from '@/public/icons/services/EngineStarting.svg'
import FuelIcon from '@/public/icons/services/Fuel.svg'
import WinchIcon from '@/public/icons/services/Winch.svg'
import ConsultationIcon from '@/public/icons/services/Consultation.svg'

export const ServicesData = [
  { id: 1, title: 'Эвакуатор', description: 'Доставка до ближайшего СТО или дилерского центра', icon: TowTruckIcon},
  { id: 2, title: 'Такси при эвакуации', description: 'Доставим вас до места при эвакуации авто (в пределах города)', icon: TaxiIcon },
  { id: 3, title: 'Вскрытие автомобиля', description: 'Аккуратное вскрытие без повреждений', icon: AutopsyIcon },
  { id: 4, title: 'Замена колеса', description: 'Установка запаски на месте', icon: WheelIcon },
  { id: 5, title: 'Запуск двигателя', description: 'Прикуривание от внешнего источника', icon: EngineStartingIcon },
  { id: 6, title: 'Доставка топлива', description: 'Привезем необходимое топливо (оплата по чеку АЗС)', icon: FuelIcon },
  { id: 7, title: 'Вытягивание из грязи', description: 'Если автомобиль застрял', icon: WinchIcon },
  { id: 8, title: 'Автоконсьерж', description: 'Консультация и информационная поддержка 24/7.', icon: ConsultationIcon },
]