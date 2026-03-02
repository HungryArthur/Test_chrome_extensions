package main

import (
    "log"
    "net/http"
    
    "github.com/hungryarthur/Test_chrome_extensions/backend/internal/config"
    "github.com/hungryarthur/Test_chrome_extensions/backend/internal/extension/service"
    "github.com/hungryarthur/Test_chrome_extensions/backend/internal/extension/transport/rest"
    "github.com/go-chi/chi/v5"
    "github.com/go-chi/cors"
)

func main() {
    cfg := config.Load()
    
    r := chi.NewRouter()
    
    // CORS для браузерных расширений
    r.Use(cors.Handler(cors.Options{
        AllowedOrigins:   []string{"*"}, // cfg.CORSOrigins в продакшене
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
        AllowCredentials: true,
        MaxAge:          300,
    }))
    
    // Базовые роуты
    r.Get("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Extension Backend API"))
    })
    
    // API v1
    api := r.Group("/api/v1")
    api.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("pong"))
    })
    
    // Регистрация handlers из rest пакета
    api.Mount("/extension", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        rest.RegisterHandlers(chi.NewRouter().With(r.Context(), r))
    }))
    
    // Правильная монтировка
    rest.RegisterHandlers(r.Group("/api/v1/extension"))
    
    log.Printf("🚀 Server starting on http://localhost:%s", cfg.Port)
    log.Fatal(http.ListenAndServe(":"+cfg.Port, r))
}
