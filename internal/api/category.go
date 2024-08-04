package api

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github/moura95/meli-api/internal/util"
	"github/moura95/meli-api/pkg/errors"
	"github/moura95/meli-api/pkg/ginx"
)

type createCategoryRequest struct {
	Name     string `json:"name" validate:"required"`
	ParentId int32  `json:"parent_id"`
}

type updateCategoryRequest struct {
	Name     string `json:"name"`
	ParentId int32  `json:"parent_id"`
}

type categoryResponse struct {
	Id       int32  `json:"id"`
	Name     string `json:"name"`
	ParentId *int32 `json:"parent_id"`
}

func (t *CategoryRouter) list(c *gin.Context) {
	t.logger.Info("List All Categories")
	parentIdStr := c.Query("parent_id")

	categories, err := t.service.GetAll(c, parentIdStr)
	if err != nil {
		t.logger.Error(err)
		c.JSON(http.StatusInternalServerError, ginx.ErrorResponse(errors.FailedToList("Categories")))
		return
	}
	var resp []categoryResponse

	for _, cate := range categories {
		resp = append(resp, categoryResponse{
			Id:       cate.ID,
			Name:     cate.Name,
			ParentId: util.NullInt32ToPtr(cate.ParentID)})
	}

	c.JSON(http.StatusOK, ginx.SuccessResponseWithPageInfo(resp, ginx.PageInfo{}))
}

func (t *CategoryRouter) get(ctx *gin.Context) {

	t.logger.Info("Get By UUID Category")

	idStr := ctx.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 32)
	if err != nil {
		t.logger.Error(err)
		ctx.JSON(http.StatusBadRequest, ginx.ErrorResponse("Bad Request, Id Invalid"))
		return
	}

	category, err := t.service.GetByID(ctx, int32(id))
	fmt.Println(category)
	if err != nil {
		t.logger.Error(err)
		ctx.JSON(http.StatusInternalServerError, ginx.ErrorResponse(errors.FailedToGet("Ticket")))
		return
	}

	response := categoryResponse{
		Id:       category.ID,
		Name:     category.Name,
		ParentId: util.NullInt32ToPtr(category.ParentID)}

	ctx.JSON(http.StatusOK, ginx.SuccessResponse(response))
}

func (t *CategoryRouter) create(ctx *gin.Context) {
	var req createCategoryRequest
	t.logger.Info("Create Category")

	err := ginx.ParseJSON(ctx, &req)
	if err != nil {
		t.logger.Info("Bad Request %s", err)
		ctx.JSON(http.StatusBadRequest, err.Error())
		return
	}

	// Validate
	if err = t.validate.Struct(req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ca, err := t.service.Create(ctx, req.Name, req.ParentId)
	if err != nil {
		t.logger.Error(err)
		ctx.JSON(http.StatusInternalServerError, ginx.ErrorResponse(err.Error()))
		return
	}
	category, _ := t.service.GetByID(ctx, ca.ID)

	ctx.JSON(http.StatusCreated, ginx.SuccessResponse(category))
}

func (t *CategoryRouter) update(ctx *gin.Context) {
	var req updateCategoryRequest

	err := ginx.ParseJSON(ctx, &req)
	if err != nil {
		t.logger.Info("Bad Request %s", err)
		ctx.JSON(http.StatusBadRequest, err.Error())
		return
	}
	t.logger.Info("Update Category")

	idStr := ctx.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 32)
	if err != nil {
		t.logger.Error(err)
		ctx.JSON(http.StatusBadRequest, ginx.ErrorResponse("Bad Request, Id Invalid"))
		return
	}

	err = t.service.Update(ctx, int32(id), req.ParentId, req.Name)
	if err != nil {
		t.logger.Error(err)
		ctx.JSON(http.StatusInternalServerError, ginx.ErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusNoContent, ginx.SuccessResponse(""))
}

func (t *CategoryRouter) hardDelete(ctx *gin.Context) {

	t.logger.Info("Delete UUID Category")

	idStr := ctx.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 32)
	if err != nil {
		t.logger.Error(err)
		ctx.JSON(http.StatusBadRequest, ginx.ErrorResponse("Bad Request, Id Invalid"))
		return
	}

	err = t.service.Delete(ctx, int32(id))
	if err != nil {
		t.logger.Error(err)
		ctx.JSON(http.StatusInternalServerError, ginx.ErrorResponse(errors.FailedToDelete("Category")))
		return
	}

	ctx.JSON(http.StatusOK, ginx.SuccessResponse("Ok"))
}
