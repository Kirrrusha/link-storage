# Link Storage Monorepo

Монорепозиторий для проекта Link Storage, построенный на основе pnpm workspaces.

## Структура проекта

```
link-storage/
├── apps/                    # Приложения
│   ├── web/                # Веб-приложение (Next.js)
│   └── api/                # API сервер (NestJS + Prisma)
├── packages/               # Общие пакеты
│   ├── ui/                # UI компоненты
│   └── utils/             # Утилиты
├── tools/                 # Инструменты и конфигурации
├── package.json           # Корневой package.json
├── pnpm-workspace.yaml    # Конфигурация workspaces
└── README.md
```

## Требования

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## Установка

1. Установите pnpm глобально (если еще не установлен):
```bash
npm install -g pnpm
```

2. Установите зависимости для всех пакетов:
```bash
pnpm install
```

## Доступные команды

### Корневые команды

```bash
# Установка зависимостей для всех пакетов
pnpm install

# Сборка всех пакетов
pnpm build

# Запуск dev режима для всех пакетов
pnpm dev

# Запуск тестов для всех пакетов
pnpm test

# Линтинг всех пакетов
pnpm lint

# Очистка build артефактов
pnpm clean

# API специфичные команды
pnpm api:dev              # Запуск API в режиме разработки
pnpm api:build            # Сборка API
pnpm api:start            # Запуск API в продакшене
pnpm api:prisma:generate  # Генерация Prisma клиента
pnpm api:prisma:migrate   # Применение миграций БД
pnpm api:prisma:push      # Синхронизация схемы с БД
pnpm api:prisma:studio    # Открытие Prisma Studio
```

### Команды для конкретных пакетов

```bash
# Запуск команды в конкретном пакете
pnpm --filter @link-storage/web dev
pnpm --filter @link-storage/ui build
pnpm --filter @link-storage/utils test

# Добавление зависимости в конкретный пакет
pnpm --filter @link-storage/web add react-router-dom
pnpm --filter @link-storage/ui add -D @types/react
```

## Пакеты

### Apps

#### @link-storage/web
Основное веб-приложение на Next.js.

**Команды:**
- `pnpm dev` - запуск в режиме разработки
- `pnpm build` - сборка для продакшена
- `pnpm start` - запуск продакшен версии

#### @link-storage/api
API сервер на NestJS с Prisma ORM для работы с базой данных PostgreSQL.

**Возможности:**
- CRUD операции для ссылок
- Система тегов
- Поддержка пользователей
- Публичные и приватные ссылки
- Swagger документация
- PostgreSQL база данных

**Команды:**
- `pnpm start:dev` - запуск в режиме разработки
- `pnpm build` - сборка для продакшена
- `pnpm start:prod` - запуск продакшен версии
- `pnpm prisma:generate` - генерация Prisma клиента
- `pnpm prisma:migrate` - применение миграций
- `pnpm prisma:studio` - открытие Prisma Studio

**Эндпоинты:**
- `GET /api/links` - получить все ссылки
- `POST /api/links` - создать ссылку
- `GET /api/links/:id` - получить ссылку по ID
- `PATCH /api/links/:id` - обновить ссылку
- `DELETE /api/links/:id` - удалить ссылку
- `GET /api/links/public` - получить публичные ссылки
- `GET /api/links/by-tags` - найти ссылки по тегам
- `GET /api/docs` - Swagger документация

### Packages

#### @link-storage/ui
Библиотека переиспользуемых UI компонентов.

**Экспортируемые компоненты:**
- `Button` - кнопка с различными вариантами стилизации

#### @link-storage/utils
Общие утилиты и хелперы.

**Экспортируемые функции:**
- `isValidUrl(url: string)` - проверка валидности URL
- `extractDomain(url: string)` - извлечение домена из URL
- `formatUrlForDisplay(url: string)` - форматирование URL для отображения

## Работа с зависимостями

### Добавление зависимостей

```bash
# В корневой package.json (dev зависимости)
pnpm add -D -w typescript

# В конкретный пакет
pnpm --filter @link-storage/web add axios

# Workspace зависимость (между пакетами в монорепе)
pnpm --filter @link-storage/web add @link-storage/ui@workspace:*
```

### Удаление зависимостей

```bash
# Из конкретного пакета
pnpm --filter @link-storage/web remove axios

# Из корня
pnpm remove -w typescript
```

## Разработка

### Создание нового пакета

1. Создайте директорию в `packages/` или `apps/`
2. Добавьте `package.json` с именем в формате `@link-storage/package-name`
3. Убедитесь, что пакет попадает под паттерны в `pnpm-workspace.yaml`

### Использование workspace зависимостей

Пакеты в монорепе могут ссылаться друг на друга через `workspace:*`:

```json
{
  "dependencies": {
    "@link-storage/ui": "workspace:*",
    "@link-storage/utils": "workspace:*"
  }
}
```

### Сборка и типы

Для TypeScript пакетов рекомендуется:
1. Компилировать в `dist/` директорию
2. Экспортировать типы через `types` поле в `package.json`
3. Использовать `tsc` для сборки

## Полезные команды pnpm

```bash
# Показать дерево зависимостей
pnpm list

# Показать устаревшие зависимости
pnpm outdated

# Обновить зависимости
pnpm update

# Запустить команду во всех пакетах
pnpm -r exec rm -rf dist

# Запустить команду только в пакетах с определенным скриптом
pnpm -r --filter="./packages/*" build
```

## Troubleshooting

### Проблемы с зависимостями

Если возникают проблемы с зависимостями:

```bash
# Очистить node_modules и переустановить
rm -rf node_modules packages/*/node_modules apps/*/node_modules
pnpm install

# Очистить pnpm store
pnpm store prune
```

### Проблемы с TypeScript

Убедитесь, что:
1. Все пакеты собраны (`pnpm build`)
2. TypeScript конфигурация корректна
3. Workspace зависимости указаны правильно

## Дополнительные ресурсы

- [pnpm Workspaces документация](https://pnpm.io/workspaces)
- [Monorepo best practices](https://monorepo.tools/)
