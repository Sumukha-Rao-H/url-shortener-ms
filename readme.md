# URL Shortener Microservice (README 2.1)

This is a basic microservice-based URL shortener project built with:

- 🐳 Docker  
- 🏗️ Docker Compose  
- 🐹 Go (Golang)  
- 🌐 NGINX
- 🐘 PostgreSQL
- 🧠 Kafka  
- ⛵ Kubernetes (coming soon)

---

## 🐳 Container Overview

This project is built using multiple Docker containers orchestrated with `docker-compose`. Below is a summary of each container and its role in the architecture:

| Service         | Description                                                                 | Port(s)       | Depends On                  |
|------------------|------------------------------------------------------------------------------|---------------|-----------------------------|
| 🔗 **shortener**   | Generates and stores short URLs in PostgreSQL                              | `8081:8081`   | `postgres`                  |
| ↪️ **redirector**   | Redirects short URLs to original URLs and publishes visit events to Kafka | `8082:8080`   | `shortener`, `kafka`        |
| 📊 **analytics**    | Subscribes to visit events from Kafka and logs them in PostgreSQL          | *(internal)* | `postgres`, `kafka`         |
| 🌐 **nginx-gateway**| Acts as an API gateway routing traffic to appropriate services             | `8080:80`     | `shortener`, `redirector`   |
| 🐘 **postgres**     | PostgreSQL database used by shortener and analytics                        | `5433:5433`   | –                           |
| 🧵 **kafka**        | Apache Kafka message broker for service communication                     | `9092:9092`   | `zookeeper`                 |
| 🦓 **zookeeper**    | Kafka dependency for distributed coordination                              | `2181:2181`   | –                           |

ℹ️ All services are configured in `docker-compose.yml` and can be started using:

    docker compose up

## 🚀 Services

### 1. Shortener Service

- **Endpoint:** `POST /shorten`  
- **Port:** `8081`  
- **Description:** Takes a long URL and returns a shortened version using SHA-256 + Base64 hashing.

### 2. Redirector Service

- **Endpoint:** `GET /r/{shortcode}`  
- **Port:** `8082`  
- **Description:** Will redirect short URLs to the original ones.

### 3. Analytics Service

- **Subscribed Topic:** `url_visits`  
- **Port:** `(No HTTP endpoint; background service)`  
- **Description:** Subscribes to Kafka topic url_visits. Whenever a short_url is visited, this service logs the event into a PostgreSQL table url_visits, storing the short_url and a timestamp. This data can be used later for building analytics dashboards.

---

## 📁 Folder Structure

    .
    ├── analytics
    │   ├── Dockerfile
    │   ├── go.mod
    │   ├── go.sum
    │   └── main.go
    ├── commands.txt
    ├── docker-compose.yml
    ├── nginx
    │   ├── Dockerfile
    │   └── nginx.conf
    ├── readme.md
    ├── redirector
    │   ├── Dockerfile
    │   ├── go.mod
    │   ├── go.sum
    │   └── main.go
    └── shortener
        ├── Dockerfile
        ├── go.mod
        ├── go.sum
        └── main.go

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
