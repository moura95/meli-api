package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github/moura95/meli-api/config"
	"github/moura95/meli-api/internal/api"
	"github/moura95/meli-api/internal/middleware"
	"github/moura95/meli-api/internal/repository"
	"github/moura95/meli-api/internal/service"

	"go.uber.org/zap"
)

type Server struct {
	store  *repository.Querier
	router *gin.Engine
	config *config.Config
	logger *zap.SugaredLogger
}

func NewServer(cfg config.Config, store repository.Querier, log *zap.SugaredLogger) *Server {

	server := &Server{
		store:  &store,
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
	createRoutesV1(&store, server.config, router, log)

	server.router = router
	return server
}

func createRoutesV1(store *repository.Querier, cfg *config.Config, router *gin.Engine, log *zap.SugaredLogger) {
	routes := router.Group("/")
	// Instance Ticket Service
	ticketService := service.NewTicketService(*store, *cfg, log)
	api.NewTicketRouter(*ticketService, log).SetupTicketRoute(routes)

	// Instance Category Service
	categoryService := service.NewCategoryService(*store, *cfg, log)
	api.NewCategoryRouter(*categoryService, log).SetupCategoryRoute(routes)

}

func (s *Server) Start(address string) error {
	return s.router.Run(address)
}

func RunGinServer(cfg config.Config, store repository.Querier, log *zap.SugaredLogger) {
	server := NewServer(cfg, store, log)

	_ = server.Start(cfg.HTTPServerAddress)
}
