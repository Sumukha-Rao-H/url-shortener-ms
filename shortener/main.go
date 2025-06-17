package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/redis/go-redis/v9"
)

var db *pgx.Conn
var rdb *redis.Client
var ctx = context.Background()

func main() {
	//redis initialization
	rdb = redis.NewClient(&redis.Options{
		Addr:     getEnv("REDIS_ADDR", "redis:6379"),
		Password: "", // No password by default
		DB:       0,
	})

	if _, err := rdb.Ping(ctx).Result(); err != nil {
		log.Fatalf("Redis connection error: %v\n", err)
	}

	defer rdb.Close()

	// DB connection setup
	dbURL := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		getEnv("DB_USER", "postgres"),
		getEnv("DB_PASSWORD", "password"),
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_PORT", "5432"),
		getEnv("DB_NAME", "shortener_db"),
	)

	var err error
	db, err = pgx.Connect(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("DB connection error: %v\n", err)
	}
	defer db.Close(context.Background())

	// HTTP route
	http.HandleFunc("/shorten", shortenHandler)

	fmt.Println("Shortener running on :8081")
	log.Fatal(http.ListenAndServe(":8081", nil))
}

func getEnv(key, fallback string) string {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	return val
}

func shortenHandler(w http.ResponseWriter, r *http.Request) {
	originalURL := r.URL.Query().Get("url")
	if originalURL == "" {
		http.Error(w, "Missing 'url' parameter", http.StatusBadRequest)
		return
	}

	// Redis key: freq:original_url -> frequency
	// Redis key: cache:original_url -> short_url
	freqKey := fmt.Sprintf("freq:%s", originalURL)
	cacheKey := fmt.Sprintf("cache:%s", originalURL)

	// Check if it's cached
	if cachedShort, err := rdb.Get(ctx, cacheKey).Result(); err == nil {
		// Increase access frequency
		rdb.Incr(ctx, freqKey)
		fmt.Fprintf(w, "Shortened URL (cache): http://localhost:8082/%s", cachedShort)
		return
	}

	// Generate new short URL
	short := generateShortURL(originalURL)

	// Save to DB and publish to Kafka
	shortURL, err := saveToDB(originalURL, short)
	if err != nil {
		log.Printf("DB Error: %v\n", err)
		http.Error(w, "Failed to save to DB", http.StatusInternalServerError)
		return
	}

	// Track frequency
	rdb.Incr(ctx, freqKey)

	// Cache the result with TTL (Redis LRU policy handles eviction)
	rdb.Set(ctx, cacheKey, shortURL, 24*time.Hour)

	fmt.Fprintf(w, "Shortened URL: http://localhost:8082/%s", shortURL)
}

func saveToDB(originalURL, shortURL string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// Check if URL already exists
	var existingShortURL string
	err := db.QueryRow(ctx, "SELECT short_url FROM urls WHERE original_url = $1", originalURL).Scan(&existingShortURL)
	if err == nil {
		log.Printf("URL already exists. Returning existing short URL: %s\n", existingShortURL)
		return existingShortURL, nil
	} else if err != pgx.ErrNoRows {
		return "", err
	}

	// Insert new URL
	_, err = db.Exec(ctx, "INSERT INTO urls (original_url, short_url) VALUES ($1, $2)", originalURL, shortURL)
	if err != nil {
		return "", err
	}

	return shortURL, nil
}

func generateShortURL(input string) string {
	return uuid.New().String()[:6]
}
