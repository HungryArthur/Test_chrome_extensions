package http

import (
    "encoding/json"
    "net/http"
    
    "github.com/go-chi/chi/v5"
    "github.com/hungryarthur/Test_chrome_extensions/backend/internal/extension/service"
)

func RegisterHandlers(r *chi.Mux) {
    r.Get("/data", getData)
    r.Post("/sync", syncData)
}

func getData(w http.ResponseWriter, r *http.Request) {
    data := service.GetData()
    json.NewEncoder(w).Encode(data)
}

func syncData(w http.ResponseWriter, r *http.Request) {
    var req service.SyncRequest
    json.NewDecoder(r.Body).Decode(&req)
    service.SyncData(req)
    w.WriteHeader(http.StatusOK)
}
