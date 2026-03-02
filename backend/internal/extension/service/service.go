package service

import (
    "time"
)

type DataItem struct {
    ID      string    `json:"id"`
    Value   string    `json:"value"`
    Updated time.Time `json:"updated"`
}

type SyncRequest struct {
    Items []DataItem `json:"items"`
}

var dataStore []DataItem  // В памяти для простоты

// Инициализация данных
func init() {
    dataStore = []DataItem{
        {ID: "1", Value: "Hello from Go!", Updated: time.Now()},
    }
}

// GetData возвращает все данные расширения
func GetData() []DataItem {
    return dataStore
}

// SyncData синхронизирует данные от расширения
func SyncData(req SyncRequest) {
    dataStore = req.Items
}
