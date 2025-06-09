package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"net/http"
	"strings"

	_ "github.com/lib/pq"
)

func main() {
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

		// Redirect to original URL
		http.Redirect(w, r, originalURL, http.StatusFound)
	})

	fmt.Println("Redirector running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
