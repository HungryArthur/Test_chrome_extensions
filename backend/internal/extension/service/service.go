package service

import "backend/internal/extension/storage"

var store = storage.NewMemoryStore()

func init() {
	store.InitTestData()
}

func GetData() []storage.DataItem {
	return store.GetData()
}

func SyncData(req storage.SyncRequest) {
	store.SyncData(req)
}
