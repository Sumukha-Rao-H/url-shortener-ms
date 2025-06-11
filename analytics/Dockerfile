FROM golang:1.24.4-alpine
WORKDIR /app
COPY . .
RUN go build -o analytics
CMD ["./analytics"]