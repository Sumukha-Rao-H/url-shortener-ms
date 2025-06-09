package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
	"github.com/jackc/pgx/v5"
	"github.com/google/uuid"
)

var db *pgx.Conn

func main() {
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

	short := generateShortURL(originalURL)

	err := saveToDB(originalURL, short)
	if err != nil {
		log.Printf("DB Error: %v\n", err)
		http.Error(w, "Failed to save to DB", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "Shortened URL: http://localhost:8082/%s", short)
}

func saveToDB(originalURL, shortURL string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	_, err := db.Exec(ctx, "INSERT INTO urls (original_url, short_url) VALUES ($1, $2)", originalURL, shortURL)
	return err
}

func generateShortURL(input string) string {
    return uuid.New().String()[:6]
}
