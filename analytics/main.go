package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Analytics service running")
	})

	fmt.Println("Analytics running on :8083")
	log.Fatal(http.ListenAndServe(":8083", nil))
}
