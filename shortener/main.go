package main

import (
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
)

var urlMap = make(map[string]string)

type shortenRequest struct {
	URL string `json:"url"`
}

type shortenResponse struct {
	ShortURL string `json:"short_url"`
}

func shortenHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is supported", http.StatusMethodNotAllowed)
		return
	}

	var req shortenRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil || req.URL == "" {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Generate a SHA-256 hash
	hash := sha256.Sum256([]byte(req.URL))

	// Base64 encode and take only first 6 chars
	encoded := base64.URLEncoding.EncodeToString(hash[:])
	short := encoded[:6]

	// Save mapping
	urlMap[short] = req.URL

	// Return short URL (for now, just return the code)
	resp := shortenResponse{ShortURL: fmt.Sprintf("http://localhost:8082/r/%s", short)}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func main() {
	http.HandleFunc("/shorten", shortenHandler)
	fmt.Println("Shortener service running on :8080")
	http.ListenAndServe(":8080", nil)
}
