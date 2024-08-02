// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0

package repository

import (
	"context"
)

type Querier interface {
	CreateTicket(ctx context.Context, arg CreateTicketParams) (Ticket, error)
	DeleteTicket(ctx context.Context, id int32) error
	GetTicketById(ctx context.Context, id int32) (Ticket, error)
	ListTickets(ctx context.Context) ([]Ticket, error)
	UpdateTicket(ctx context.Context, arg UpdateTicketParams) error
}

var _ Querier = (*Queries)(nil)
