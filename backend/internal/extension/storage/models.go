package storage

import (
	"time"
)

// DataItem - данные для синхронизации с расширением
type DataItem struct {
	ID      string    `json:"id"`
	Value   string    `json:"value"`
	Updated time.Time `json:"updated"`
}

// SyncRequest - запрос синхронизации от расширения
type SyncRequest struct {
	Items []DataItem `json:"items"`
}

// UserState - состояние пользователя расширения
type UserState struct {
	UserID    string     `json:"user_id"`
	Data      []DataItem `json:"data"`
	LastSync  time.Time  `json:"last_sync"`
	Extension string     `json:"extension_id"`
}
