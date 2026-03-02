package logger

import (
	"log"
	"net/http"
	"os"
	"time"
)

var (
	Info  = log.New(os.Stdout, "ℹ️  ", log.LstdFlags|log.Lshortfile)
	Error = log.New(os.Stderr, "❌ ", log.LstdFlags|log.Lshortfile)
	Warn  = log.New(os.Stdout, "⚠️  ", log.LstdFlags|log.Lshortfile)
)

// RequestLogger логирует все HTTP запросы
func RequestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		Info.Printf("%s %s %s", r.Method, r.URL.Path, r.RemoteAddr)

		next.ServeHTTP(w, r)

		duration := time.Since(start)
		Info.Printf("%s %s %dms", r.Method, r.URL.Path, duration.Milliseconds())
	})
}

// ResponseLogger логирует статус коды
func ResponseLogger(inner http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		lw := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}
		inner.ServeHTTP(lw, r)
	})
}

type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}
