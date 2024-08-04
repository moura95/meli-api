package api

import (
	"github.com/gin-gonic/gin"
	"github/moura95/meli-api/internal/service"
	"go.uber.org/zap"
)

type ICategory interface {
	SetupCategoryRoute(routers *gin.RouterGroup)
}

type CategoryRouter struct {
	service service.CategoryService
	logger  *zap.SugaredLogger
}

func NewCategoryRouter(s service.CategoryService, log *zap.SugaredLogger) *CategoryRouter {
	return &CategoryRouter{
		service: s,
		logger:  log,
	}
}

func (t *CategoryRouter) SetupCategoryRoute(routers *gin.RouterGroup) {
	routers.GET("/categories", t.list)
	routers.GET("/categories/:id", t.get)
	routers.DELETE("/categories/:id", t.hardDelete)
	routers.POST("/categories", t.create)
	routers.PATCH("/categories/:id", t.update)
}
