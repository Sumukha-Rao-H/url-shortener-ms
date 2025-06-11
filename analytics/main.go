package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
	"github.com/segmentio/kafka-go"
)

func main() {
	// Kafka consumer config
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:   []string{getEnv("KAFKA_BROKER", "kafka:9092")},
		Topic:     "url_redirected",
		Partition: 0,
		MinBytes:  10e3, // 10KB
		MaxBytes:  10e6, // 10MB
	})
	defer r.Close()

	// Connect to PostgreSQL
	connStr := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable",
		getEnv("DB_HOST", "postgres"),
		getEnv("DB_USER", "postgres"),
		getEnv("DB_PASSWORD", "password"),
		getEnv("DB_NAME", "shortener_db"),
	)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect to DB:", err)
	}
	defer db.Close()

	log.Println("Analytics service started...")

	for {
		msg, err := r.ReadMessage(context.Background())
		if err != nil {
			log.Println("Error reading Kafka message:", err)
			continue
		}

		log.Println("📥 Received Kafka message:", string(msg.Value)) // 👈 Add this log

		_, err = db.Exec("INSERT INTO url_visits (short_url) VALUES ($1)", string(msg.Value))
		if err != nil {
			log.Println("❌ Failed to insert visit:", err)
		} else {
			log.Println("✅ Visit recorded for:", string(msg.Value))
		}
	}

}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
