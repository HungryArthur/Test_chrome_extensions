package rest

import (
	"backend/internal/extension/service"
	"backend/internal/extension/storage"
	"backend/internal/logger"
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
	logger.Info.Printf("📥 GET data: %s", r.RemoteAddr)
	data := store.GetData()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
	logger.Info.Println("📤 Data sent successfully")
}

func syncData(w http.ResponseWriter, r *http.Request) {
    logger.Info.Printf("📥 SYNC data from: %s", r.RemoteAddr)
    
    var req storage.SyncRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        logger.Error.Printf("❌ Decode error: %v", err)
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    service.SyncData(req)
    logger.Info.Printf("✅ Synced %d items", len(req.Items))
    w.WriteHeader(http.StatusOK)
}
