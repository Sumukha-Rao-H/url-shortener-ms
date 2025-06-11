package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	_ "github.com/lib/pq"
	"github.com/segmentio/kafka-go"
)

var kafkaWriter *kafka.Writer

func main() {

	//Setup Kafka writer
	kafkaWriter = kafka.NewWriter(kafka.WriterConfig{
		Brokers:  []string{getEnv("KAFKA_BROKER", "localhost:9092")},
		Topic:    "url_redirected",
		Balancer: &kafka.LeastBytes{},
	})
	defer kafkaWriter.Close()

	// Setup DB connection (adjust these with your actual credentials)
	connStr := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("DB connection error:", err)
	}
	defer db.Close()

	http.HandleFunc("/r/", func(w http.ResponseWriter, r *http.Request) {
		// Extract short code from URL: /r/{shortCode}
		shortCode := strings.TrimPrefix(r.URL.Path, "/r/")
		if shortCode == "" {
			http.Error(w, "Short code missing", http.StatusBadRequest)
			return
		}

		// Query original URL from DB
		var originalURL string
		err := db.QueryRow("SELECT original_url FROM urls WHERE short_url = $1", shortCode).Scan(&originalURL)
		if err != nil {
			if err == sql.ErrNoRows {
				http.NotFound(w, r)
			} else {
				http.Error(w, "Server error", http.StatusInternalServerError)
				log.Println("DB query error:", err)
			}
			return
		}

		//send analytics message
		msg := kafka.Message{
			Key:   []byte(shortCode),
			Value: []byte(fmt.Sprintf("Redirected to: %s", originalURL)),
		}
		if err := kafkaWriter.WriteMessages(context.Background(), msg); err != nil {
			log.Println("Failed to publish Kafka message:", err)
		}

		// Redirect to original URL
		http.Redirect(w, r, originalURL, http.StatusFound)
	})

	fmt.Println("Redirector running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func getEnv(key, fallback string) string {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	return val
}
