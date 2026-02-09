import videoBG from '../../public/images/videoBG.svg'

export const knowledgeBase = [
  {
    id: 1,
    title: 'Как правильно передать QR-код?',
    content:
      'Снимите защитный слой на промо-карте и обязательно отсканируйте код, будучи залогиненым через <a href="https://manager.ids-help.by/login" target="_blank">manager.ids-help.by/login</a>. Только после этого вручите флаер клиенту, напомнив, что он должен активировать его на сайте в течение 60 дней.',
  },
  {
    id: 2,
    title: 'Код не сканируется. Что делать?',
    content:
      'Проверьте освещение и чистоту линзы камеры. Если проблема сохраняется, обратитесь в техподдержку через <a href="https://t.me/IDS-Help" target="_blank">Telegram-канал IDS-Help</a> или по почте <a href="mailto:support@ids-help.by">support@ids-help.by</a>.',
  },
  {
    id: 3,
    title: 'Клиент потерял QR-код.',
    content:
      'Зайдите в раздел «Статистика» в личном кабинете менеджера, чтобы найти данные клиента по VIN или ФИО. Для выдачи дубликата или восстановления доступа создайте запрос в разделе «Поддержка».',
  },
]

export const mediaResources = [
  {
    id: 1,
    title: 'Как завести нового клиента в системе?',
    type: 'Видеоурок',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '1:23',
    image: videoBG,
  },
  {
    id: 2,
    title: 'Где и как я могу посмотреть всех клиентов, которым отдал коды?',
    type: 'Видеоурок',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '5:58',
    image: videoBG,
  },
  {
    id: 3,
    title: 'Как добавить комментарий или пометку к данным уже существующего клиента?',
    type: 'Видеоурок',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '4:45',
    image: videoBG,
  },
]
