# ООО "СБЛ-Лизинг"

Добро пожаловать в репозиторий сайта СБЛ-Лизинг. Этот проект включает в себя фронтенд на Next.js и бэкенд на Django.py с базой данных PostgreSQL.

## Описание

Сайт проекта СБЛ-Лизинг предоставляет информацию о наших услугах, ценах и контактные данные. Пользователи могут ознакомиться с каталогом товаров, оставлять заявки на них и связываться с менеджерами.

## Технологии

### Фронтенд

- **Next.js** - библиотека для создания пользовательских интерфейсов.

### Бэкенд

- **Django.py** - веб-фреймворк для Python.
- **PostgreSQL** - реляционная база данных для хранения данных.

## Установка

### Предварительные требования

Для запуска проекта вам потребуются:

- Node.js (рекомендуется версия 23.x или выше)
- Python (рекомендуется версия 3.14 или выше)
- PostgreSQL (рекомендуется версия 17.x или выше)

### Шаги для установки

1. **Клонирование репозитория:**

   ```sh
   git clone https://gitlab.com/wedeving/autoconcierge-www.git
   cd autoconcierge-www
   ```

2. **Установка зависимостей для фронтенда и бэкенда:**

   ```sh
   cd frontend
   npm install

   cd backend
   uv init
   uv venv
   source .venv/bin/activate
   uv sync --locked
   ```

3. **Настройка базы данных:**

   Создайте базу данных PostgreSQL и выполните миграции:

   ```sh
   createdb autoconciergedb
   # Выполните миграции, если они имеются. В проекте откройте директорию backend
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Настройка переменных окружения:**

   Создайте файл `.env` в директории `backend` и добавьте необходимые переменные окружения:

   ```env
   #django settings
   SECRET_KEY =
   DEBUG_MODE=
   BASE_URL=
   CORS_ALLOWED_ORIGINS=
   ALLOWED_HOSTS=
   CSRF_TRUSTED_ORIGINS=

   # database connection
   DB_USER
   DB_HOST
   DB_NAME
   DB_PASSWORD
   DB_PORT=5432

   #sms provider
   SMS_USER=
   SMS_API_KEY=
   ```

5. **Локальная разработка:**

   Откройте три терминала или используйте вкладки в одном терминале.

   В первом терминале запустите бэкенд:

   ```
   cd backend
   python manage.py runserver
   ```

   Во втором терминале запустите фронтенд:

   ```
   cd frontend
   npm run dev
   ```

Теперь проект будет доступен по адресу `http://localhost:3000`.

### Инструкция по деплою.

1. **Заходим в нужные директории:**

   ```sh
   cd backend
   cd frontend
   ```

2. **Запускаем сборку контейнеров в каждом терминале:**

   ```sh
   just build-prod
   ```

3. **Добавляем ключ гитлаба (один раз на сессию терминала, нужно каждый раз делать заново):**

   ```sh
   export GITLAB_TOKEN={token} ;export GITLAB_USER={user}
   ```

4. **Проверяем, что ключи добавились:**

   ```sh
   env
   ```
   В консоли должны увидеть наш ключ и имя пользователя

5. **Заливаем свежую сборку в GitLab (отдельно каждый контейнер):**

   ```sh
   just push-prod
   ```

6. **Собираем в продакшне:**

   ```sh
   cd ansible
   ansible-playbook -i inventory/prod.yaml playbooks/autoconcierge.yaml 
   ```
   Эта создает и запускает все контейнеры, контейнеры должны быть до этого загружены в registry.

### Миграции на серверах.

1. **После сборки заходим в контейнер:**

   ```sh
   ssh ids@ids-help.by
   docker exec -it prod-backend-1 sh
   ```

2. **Проводим миграции:**

   ```sh
   uv run manage.py migrate
   ```

### Логи в продакшне.

1. **Логи фронтенда:**

   ```sh
   docker logs -f prod-frontend-1
   ```

2. **Логи бекенда:**

   ```sh
   docker logs -f prod-backend-1
   ```

3. **Логи сервера:**

   ```sh
   tail -f /var/log/angie/access.log
   ```

