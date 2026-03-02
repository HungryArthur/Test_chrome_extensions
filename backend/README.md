backend/
├── cmd/
│   └── server/
│       └── main.go          # Точка входа, запуск сервера
├── internal/
│   ├── config/
│   │   └── config.go        # Загрузка конфига (порт, CORS, ключи)
│   ├── extension/           # Основная фича для расширения
│   │   ├── transport/
│   │   │   └── http/
│   │   │       ├── handler.go  # HTTP-обработчики (/api/data, /api/sync)
│   │   │       └── cors.go     # CORS middleware для браузера
│   │   ├── service/
│   │   │   └── service.go      # Бизнес-логика (хранение данных расширения)
│   │   └── storage/
│   │       ├── memory.go       # В памяти (или файл/БД)
│   │       └── models.go       # Структуры (DataItem, UserState)
│   └── logger/
│       └── logger.go          # Логирование (zap или log/slog)
├── go.mod
├── go.sum
└── .env                      # PORT=8080, CORS_ORIGIN=chrome-extension://...


