package rest

import (
	"backend/internal/extension/service"
	"backend/internal/extension/storage"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

var store = storage.NewMemoryStore() // Глобальный store

func init() {
	store.InitTestData()
}


func RegisterHandlers(r chi.Router) {
	r.Get("/data", getData)
	r.Post("/sync", syncData)
}

func getData(w http.ResponseWriter, r *http.Request) {
	data := store.GetData() // Используем глобальный store
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func syncData(w http.ResponseWriter, r *http.Request) {
	var req storage.SyncRequest // Из storage, не service
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	service.SyncData(req) // Через service слой
	w.WriteHeader(http.StatusOK)
}
