package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/r/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Redirector: Redirecting to original URL.")
	})
	fmt.Println("Redirector running on :8080")
	http.ListenAndServe(":8080", nil)
}
