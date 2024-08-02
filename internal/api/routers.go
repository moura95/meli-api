package api

import (
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github/moura95/meli-api/config"

	"go.uber.org/zap"
)

func CreateRoutesV1(store *sqlx.DB, cfg *config.Config, router *gin.Engine, log *zap.SugaredLogger) {
	//routes := router.Group("/")

}
