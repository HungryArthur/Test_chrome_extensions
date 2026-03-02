package rest

import (
	"backend/internal/extension/service"
	"backend/internal/extension/storage"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func RegisterHandlers(r *chi.Mux) {
	r.Get("/data", getData)
	r.Post("/sync", syncData)
}

func getData(w http.ResponseWriter, r *http.Request) {
	data := storage.NewMemoryStore().GetData() // Теперь из store
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func syncData(w http.ResponseWriter, r *http.Request) {
	var req service.SyncRequest
	json.NewDecoder(r.Body).Decode(&req)
	service.SyncData(req)
	w.WriteHeader(http.StatusOK)
}
