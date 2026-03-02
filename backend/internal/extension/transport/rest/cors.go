package rest

import (
	"backend/internal/config"
	"net/http"
	"strings"

	"github.com/go-chi/cors"
)

func NewCORSMiddleware(cfg *config.Config) func(http.Handler) http.Handler {
	return cors.Handler(cors.Options{
		// Разрешаем все chrome-extension origins
		AllowedOrigins: []string{"chrome-extension://*", "moz-extension://*"},
		AllowedOriginsValidator: func(r *http.Request, origin string) bool {
			// Локальные разработки + все расширения
			return strings.HasPrefix(origin, "chrome-extension://") ||
				strings.HasPrefix(origin, "moz-extension://") ||
				strings.Contains(origin, "localhost") ||
				strings.Contains(origin, "127.0.0.1")
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
		MaxAge:           300, // 5 минут кэш preflight
	})
}
