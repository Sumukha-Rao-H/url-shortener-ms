# URL Shortener Microservice (README 1.4.2)

This is a basic microservice-based URL shortener project built with:

- 🐳 Docker  
- 🏗️ Docker Compose  
- 🐹 Go (Golang)  
- 🌐 NGINX  
- 🧠 Redis Pub/Sub (coming soon)  
- ⛵ Kubernetes (coming soon)  

---

## 🚀 Services

### 1. Shortener Service

- **Endpoint:** `POST /shorten`  
- **Port:** `8081`  
- **Description:** Takes a long URL and returns a shortened version using SHA-256 + Base64 hashing.

### 2. Redirector Service

- **Endpoint:** `GET /r/{shortcode}`  
- **Port:** `8082`  
- **Description:** Will redirect short URLs to the original ones (logic to be completed with Redis).

---

## 📁 Folder Structure

    url-shortener-ms/
    ├── docker-compose.yml
    ├── shortener/
    │ ├── Dockerfile
    │ └── main.go
    ├── redirector/
    │ ├── Dockerfile
    │ └── main.go

---

## 🛠️ Getting Started

### Prerequisites

- Docker  
- Docker Compose  
- Go (only for local development)

### Initialize Go Modules

    cd shortener
    go mod init shortener

    cd ../redirector
    go mod init redirector

### 🔧 Build and Run (via Docker Compose)

    docker compose up --build


### 📬 API Usage

🔗 POST /shorten

    curl "http://localhost:8081/shorten?url={original_url}"

🔗 GET /r/{shortcode}

    curl -v http://localhost:8080/r/{short_url}
