package api

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type IUser interface {
	SetupUserRoute(routers *gin.RouterGroup)
}

type UserRouter struct {
	logger *zap.SugaredLogger
}

func NewUserRouter(log *zap.SugaredLogger) *UserRouter {
	return &UserRouter{
		logger: log,
	}
}

func (t *UserRouter) SetupUserRoute(routers *gin.RouterGroup) {
	routers.GET("/users", t.list)
	routers.GET("/users/:id", t.get)
}
