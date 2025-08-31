# Link Storage API

NestJS API для хранения и управления ссылками с использованием Prisma ORM.

## Возможности

- 🔗 CRUD операции для ссылок
- 🏷️ Система тегов
- 👥 Поддержка пользователей
- 🌐 Публичные и приватные ссылки
- 📚 Swagger документация
- 🗄️ PostgreSQL база данных через Prisma

## Установка

1. Установите зависимости:
```bash
pnpm install
```

2. Настройте переменные окружения:
```bash
cp .env.example .env
```

Отредактируйте `.env` файл и укажите:
- `DATABASE_URL` - строка подключения к PostgreSQL
- `JWT_SECRET` - секретный ключ для JWT
- `PORT` - порт для API (по умолчанию 3001)

3. Настройте базу данных:
```bash
# Генерация Prisma клиента
pnpm prisma:generate

# Применение миграций
pnpm prisma:migrate

# (Опционально) Заполнение тестовыми данными
pnpm prisma:seed
```

## Запуск

### Режим разработки
```bash
pnpm start:dev
```

### Продакшн
```bash
pnpm build
pnpm start:prod
```

## API Документация

После запуска API документация будет доступна по адресу:
- Swagger UI: http://localhost:3001/api/docs

## Основные эндпоинты

### Ссылки
- `GET /api/links` - получить все ссылки
- `GET /api/links/:id` - получить ссылку по ID
- `POST /api/links` - создать новую ссылку
- `PATCH /api/links/:id` - обновить ссылку
- `DELETE /api/links/:id` - удалить ссылку
- `GET /api/links/public` - получить публичные ссылки
- `GET /api/links/by-tags?tags=tag1,tag2` - найти ссылки по тегам

### Здоровье приложения
- `GET /api/health` - проверка работы API

## Структура проекта

```
src/
├── app.module.ts          # Главный модуль приложения
├── main.ts               # Точка входа
├── prisma/               # Prisma модуль и сервис
│   ├── prisma.module.ts
│   └── prisma.service.ts
└── links/                # Модуль для работы с ссылками
    ├── dto/              # Data Transfer Objects
    ├── links.controller.ts
    ├── links.service.ts
    └── links.module.ts

prisma/
├── schema.prisma         # Схема базы данных
└── migrations/           # Миграции базы данных
```

## Модель данных

### Link (Ссылка)
- `id` - уникальный идентификатор
- `title` - заголовок ссылки
- `url` - URL ссылки
- `description` - описание (опционально)
- `tags` - массив тегов
- `isPublic` - публичная ли ссылка
- `userId` - ID пользователя-владельца
- `createdAt` - дата создания
- `updatedAt` - дата обновления

### User (Пользователь)
- `id` - уникальный идентификатор
- `email` - email пользователя
- `name` - имя пользователя (опционально)
- `createdAt` - дата создания
- `updatedAt` - дата обновления

## Команды Prisma

```bash
# Генерация клиента
pnpm prisma:generate

# Создание миграции
pnpm prisma:migrate

# Применение изменений к БД без миграции (для разработки)
pnpm prisma:push

# Открыть Prisma Studio
pnpm prisma:studio

# Заполнение БД тестовыми данными
pnpm prisma:seed
```

## Разработка

Для разработки рекомендуется:

1. Запустить PostgreSQL локально или использовать Docker
2. Настроить переменные окружения
3. Запустить API в режиме разработки: `pnpm start:dev`
4. Использовать Swagger UI для тестирования API

## Технологии

- **NestJS** - Node.js фреймворк
- **Prisma** - ORM для работы с базой данных
- **PostgreSQL** - база данных
- **Swagger** - документация API
- **TypeScript** - типизированный JavaScript
- **Class Validator** - валидация данных