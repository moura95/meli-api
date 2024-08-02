package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github/moura95/meli-api/config"
	"github/moura95/meli-api/internal/api"
	"github/moura95/meli-api/internal/middleware"

	"go.uber.org/zap"
)

type Server struct {
	store  *sqlx.DB
	router *gin.Engine
	config *config.Config
	logger *zap.SugaredLogger
}

func NewServer(cfg config.Config, store *sqlx.DB, log *zap.SugaredLogger) *Server {

	server := &Server{
		store:  store,
		config: &cfg,
		logger: log,
	}
	var router *gin.Engine

	router = gin.Default()

	router.GET("/healthz", func(c *gin.Context) {
		c.Status(http.StatusNoContent)
	})

	// Middleware Rate Limiter
	router.Use(middleware.RateLimitMiddleware())

	// Middleware Cors
	router.Use(middleware.CORSMiddleware())

	// Init all Routers
	api.CreateRoutesV1(store, server.config, router, log)

	server.router = router
	return server
}

func (s *Server) Start(address string) error {
	return s.router.Run(address)
}

func RunGinServer(cfg config.Config, store *sqlx.DB, log *zap.SugaredLogger) {
	server := NewServer(cfg, store, log)

	_ = server.Start(cfg.HTTPServerAddress)
}
