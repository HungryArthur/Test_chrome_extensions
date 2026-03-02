package storage

import (
	"sync"
	"time"
)

type MemoryStore struct {
	mu    sync.RWMutex
	items map[string]DataItem
	users map[string]UserState
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		items: make(map[string]DataItem),
		users: make(map[string]UserState),
	}
}

// Инициализация тестовыми данными
func (s *MemoryStore) InitTestData() {
	s.mu.Lock()
	defer s.mu.Unlock()

	item := DataItem{
		ID:      "test-1",
		Value:   "Hello from Go backend!",
		Updated: time.Now(),
	}
	s.items["test-1"] = item

	state := UserState{
		UserID:    "demo-user",
		Data:      []DataItem{item},
		LastSync:  time.Now(),
		Extension: "demo-extension",
	}
	s.users["demo-user"] = state
}

// GetData возвращает все элементы
func (s *MemoryStore) GetData() []DataItem {
	s.mu.RLock()
	defer s.mu.RUnlock()

	items := make([]DataItem, 0, len(s.items))
	for _, item := range s.items {
		items = append(items, item)
	}
	return items
}

// SyncData заменяет данные
func (s *MemoryStore) SyncData(req SyncRequest) {
	s.mu.Lock()
	defer s.mu.Unlock()

	for _, item := range req.Items {
		s.items[item.ID] = item
	}
}

// GetUserState возвращает состояние пользователя
func (s *MemoryStore) GetUserState(userID string) (UserState, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	state, exists := s.users[userID]
	return state, exists
}
