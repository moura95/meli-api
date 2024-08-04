// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0

package repository

import (
	"context"
	"database/sql"
)

type Querier interface {
	CreateCategory(ctx context.Context, arg CreateCategoryParams) (Category, error)
	CreateTicket(ctx context.Context, arg CreateTicketParams) (Ticket, error)
	DeleteCategory(ctx context.Context, id int32) error
	DeleteTicket(ctx context.Context, id int32) error
	GetCategoryById(ctx context.Context, id int32) (Category, error)
	GetTicketById(ctx context.Context, id int32) (Ticket, error)
	ListCategories(ctx context.Context) ([]Category, error)
	ListSubCategories(ctx context.Context, parentID sql.NullInt32) ([]Category, error)
	ListTickets(ctx context.Context) ([]Ticket, error)
	UpdateCategory(ctx context.Context, arg UpdateCategoryParams) error
	UpdateTicket(ctx context.Context, arg UpdateTicketParams) error
}

var _ Querier = (*Queries)(nil)
