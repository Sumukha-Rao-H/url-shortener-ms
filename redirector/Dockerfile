FROM golang:1.24.4-alpine
WORKDIR /app
COPY . .
RUN go build -o redirector
CMD ["./redirector"]
