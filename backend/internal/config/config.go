package config

import "os"

type Config struct {
    Port        string
    CORSOrigins string
}

func Load() *Config {
    return &Config{
        Port:        getEnv("PORT", "8080"),
        CORSOrigins: getEnv("CORS_ORIGINS", "chrome-extension://*,http://localhost:*"),
    }
}

func getEnv(key, defaultValue string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return defaultValue
}
