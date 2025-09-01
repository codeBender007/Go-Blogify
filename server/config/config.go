package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	Port       string
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string
	JWTSecret  string
	Env        string
}

var C AppConfig

// Load environment variables
func Load() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  No .env file found, using system environment variables")
	}

	// Initialize config struct
	C = AppConfig{
		Port:       getEnv("PORT", "8080"),
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", "Varun@74358"),
		DBName:     getEnv("DB_NAME", "BlogAppApplication"),
		DBSSLMode:  getEnv("DB_SSLMODE", "disable"),
		JWTSecret:  getEnv("JWT_SECRET", "supersecret"),
		Env:        getEnv("ENV", "development"),
	}
}

// Helper function to fetch environment variables
func getEnv(key, def string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return def
}

// Generate DSN dynamically
func GetDSN() string {
	return fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		C.DBHost,
		C.DBUser,
		C.DBPassword,
		C.DBName,
		C.DBPort,
		C.DBSSLMode,
	)
}
