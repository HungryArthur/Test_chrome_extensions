package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"backend/internal/config"
	"backend/internal/extension/transport/rest"
)

func main() {
	cfg := config.Load()

	r := chi.NewRouter()

	// CORS middleware на самом верху!
	r.Use(rest.NewCORSMiddleware(cfg))

	// Базовые роуты
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Extension Backend API"))
	})

	// API v1
	api := r.Group("/api/v1")
	api.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	// Extension роуты
	rest.RegisterHandlers(api.Group("/extension"))

	log.Printf("🚀 Server starting on http://localhost:%s", cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, r))
}
