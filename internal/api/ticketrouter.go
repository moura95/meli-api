package api

import (
	"github.com/gin-gonic/gin"
	"github/moura95/meli-api/internal/service"
	"go.uber.org/zap"
)

type ITicket interface {
	SetupTicketRoute(routers *gin.RouterGroup)
}

type TicketRouter struct {
	service service.TicketService
	logger  *zap.SugaredLogger
}

func NewTicketRouter(s service.TicketService, log *zap.SugaredLogger) *TicketRouter {
	return &TicketRouter{
		service: s,
		logger:  log,
	}
}

func (t *TicketRouter) SetupTicketRoute(routers *gin.RouterGroup) {
	routers.GET("/tickets", t.list)
	routers.GET("/tickets/:id", t.get)
	routers.DELETE("/tickets/:id", t.hardDelete)
	routers.POST("/tickets", t.create)
	routers.PATCH("/tickets/:id", t.update)
}
