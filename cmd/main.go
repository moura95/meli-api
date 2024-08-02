package main

import (
	"fmt"
	"log"

	"github/moura95/meli-api/config"
	"github/moura95/meli-api/db"
	server "github/moura95/meli-api/internal"
	"go.uber.org/zap"
)

func main() {
	// Configs
	loadConfig, _ := config.LoadConfig(".")

	// instance Db

	conn, err := db.ConnectPostgres(loadConfig.DBSource)

	if err != nil {
		fmt.Println("Failed to Connected Database")
		panic(err)
	}
	log.Print("connection is repository establish")
	store := conn.DB()

	// Zap Logger
	logger, _ := zap.NewProduction()
	defer logger.Sync()
	sugar := logger.Sugar()

	// Run Gin
	server.RunGinServer(loadConfig, store, sugar)
}
