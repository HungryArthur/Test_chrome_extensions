package rest

import (
	"net/http"

	"backend/internal/config"

	"github.com/go-chi/cors"
)

func NewCORSMiddleware(cfg *config.Config) func(http.Handler) http.Handler {
	return cors.Handler(cors.Options{
		// Разрешаем chrome-extension и локалхост
		AllowedOrigins: []string{
			"chrome-extension://*",
			"moz-extension://*",
			"http://localhost:*",
			"http://127.0.0.1:*",
			"https://localhost:*",
		},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
			"X-Requested-With",
			"Cache-Control",
		},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	})
}
