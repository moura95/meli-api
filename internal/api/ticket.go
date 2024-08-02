package api

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github/moura95/meli-api/pkg/errors"
	"github/moura95/meli-api/pkg/ginx"
)

type listRequest struct {
	Status     string `form:"status"`
	Title      string `form:"name"`
	SeverityId int32  `form:"severity_id"`
	Limit      int32  `form:"limit"`
	Page       int32  `form:"page"`
}

type createRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	SeverityId  int32  `json:"severity_id"`
}

type updateRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
	SeverityId  int32  `json:"severity_id"`
}

type ticketResponse struct {
	Id          int32      `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Status      string     `json:"status"`
	SeverityId  int32      `json:"severity_id"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	CompletedAt *time.Time `json:"completed_at"`
}

func (t *TicketRouter) list(c *gin.Context) {
	t.logger.Info("List All Tickets")

	var filters listRequest
	err := ginx.ParseQuery(c, &filters)
	if err != nil {
		t.logger.Error(err)
		c.JSON(http.StatusBadRequest, ginx.ErrorResponse(err.Error()))
		return
	}
	tickets, err := t.service.GetAll(c)
	if err != nil {
		t.logger.Error(err)
		c.JSON(http.StatusInternalServerError, ginx.ErrorResponse(errors.FailedToList("Tickets")))
		return
	}

	var response []ticketResponse
	for _, ticket := range tickets {
		var completedAt *time.Time
		if ticket.CompletedAt.Valid {
			completedAt = &ticket.CompletedAt.Time
		}
		response = append(response, ticketResponse{
			Id:          ticket.ID,
			Title:       ticket.Title,
			Description: ticket.Description,
			Status:      ticket.Status,
			SeverityId:  ticket.SeverityID,
			CreatedAt:   ticket.CreatedAt,
			UpdatedAt:   ticket.UpdatedAt,
			CompletedAt: completedAt,
		})

	}

	c.JSON(http.StatusOK, ginx.SuccessResponseWithPageInfo(response, ginx.PageInfo{}))
}

func (t *TicketRouter) get(ctx *gin.Context) {

	t.logger.Info("Get By UUID Ticket")

	idStr := ctx.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 32)
	if err != nil {
		t.logger.Error(err)
		ctx.JSON(http.StatusBadRequest, ginx.ErrorResponse("Bad Request, Id Invalid"))
		return
	}

	ticket, err := t.service.GetByID(ctx, int32(id))
	if err != nil {
		t.logger.Error(err)
		ctx.JSON(http.StatusInternalServerError, ginx.ErrorResponse(errors.FailedToGet("Ticket")))
		return
	}

	var completedAt *time.Time
	if ticket.CompletedAt.Valid {
		completedAt = &ticket.CompletedAt.Time
	}

	response := ticketResponse{
		Id:          ticket.ID,
		Title:       ticket.Title,
		Description: ticket.Description,
		Status:      ticket.Status,
		SeverityId:  ticket.SeverityID,
		CreatedAt:   ticket.CreatedAt,
		UpdatedAt:   ticket.UpdatedAt,
		CompletedAt: completedAt,
	}

	ctx.JSON(http.StatusOK, ginx.SuccessResponse(response))
}

func (t *TicketRouter) create(ctx *gin.Context) {
	var req createRequest
	t.logger.Info("Create Ticket")

	err := ginx.ParseJSON(ctx, &req)
	if err != nil {
		t.logger.Info("Bad Request %s", err)
		ctx.JSON(http.StatusBadRequest, err.Error())
		return
	}

	ti, err := t.service.Create(ctx, req.Title, req.Description, req.SeverityId)
	if err != nil {
		t.logger.Error(err)
		ctx.JSON(http.StatusInternalServerError, ginx.ErrorResponse(err.Error()))
		return
	}
	ticket, _ := t.service.GetByID(ctx, ti.ID)

	ctx.JSON(http.StatusCreated, ginx.SuccessResponse(ticket))
}

func (t *TicketRouter) update(ctx *gin.Context) {
	var req updateRequest

	err := ginx.ParseJSON(ctx, &req)
	if err != nil {
		t.logger.Info("Bad Request %s", err)
		ctx.JSON(http.StatusBadRequest, err.Error())
		return
	}
	t.logger.Info("Update Ticket")

	idStr := ctx.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 32)
	if err != nil {
		t.logger.Error(err)
		ctx.JSON(http.StatusBadRequest, ginx.ErrorResponse("Bad Request, Id Invalid"))
		return
	}

	err = t.service.Update(ctx, int32(id), req.SeverityId, req.Title, req.Description, req.Status)
	if err != nil {
		t.logger.Error(err)
		ctx.JSON(http.StatusInternalServerError, ginx.ErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusNoContent, ginx.SuccessResponse(""))
}

func (t *TicketRouter) hardDelete(ctx *gin.Context) {

	t.logger.Info("Delete UUID Ticket")

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
		ctx.JSON(http.StatusInternalServerError, ginx.ErrorResponse(errors.FailedToDelete("Ticket")))
		return
	}

	ctx.JSON(http.StatusOK, ginx.SuccessResponse("Ok"))
}
