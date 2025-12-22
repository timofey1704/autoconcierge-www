interface CardProps {
  id: number
  title: string | number
  description: string
}

const AboutUsCard: React.FC<CardProps> = ({ title, description }) => {
  const titleStr = String(title)
  const specialChars = /([+~%])/g

  const parts = titleStr.split(specialChars)

  return (
    <div className="rounded-[20px] bg-black p-6 shadow-lg transition-shadow hover:shadow-xl">
      <div className="text-center text-4xl font-bold text-white sm:text-4xl">
        {parts.map((part, index) => {
          // если часть - спецсимвол, красим в другой цвет
          if (['+', '~', '%'].includes(part)) {
            return (
              <span key={index} className="text-gradient">
                {part}
              </span>
            )
          }
          return <span key={index}>{part}</span>
        })}
      </div>
      <p className="mt-2 text-center text-white">{description}</p>
    </div>
  )
}

export default AboutUsCard
