package main

import (
	"log"
	"net/http"

	"backend/internal/config"
	"backend/internal/extension/transport/rest"
	"backend/internal/logger"

	"github.com/go-chi/chi/v5"
)

func main() {
	cfg := config.Load()

	r := chi.NewRouter()

	// logger
	r.Use(logger.RequestLogger)
	r.Use(logger.ResponseLogger)
	r.Use(rest.NewCORSMiddleware(cfg))

	// CORS для вашего расширения
	r.Use(rest.NewCORSMiddleware(cfg))

	// Базовые роуты
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Extension Backend API v1"))
	})

	// API роуты
	r.Get("/api/v1/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	// ✅ Extension API - монтируем handlers
	apiRouter := chi.NewRouter()
	rest.RegisterHandlers(apiRouter)
	r.Mount("/api/v1/extension", apiRouter)

	log.Printf("🚀 Backend ready: http://localhost:%s", cfg.Port)
	log.Println("📱 Test: curl http://localhost:8080/api/v1/extension/data")
	log.Fatal(http.ListenAndServe(":"+cfg.Port, r))
}
