// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: ticket.sql

package repository

import (
	"context"
	"database/sql"
	"time"
)

const createTicket = `-- name: CreateTicket :one
INSERT INTO tickets (title,description,severity_id,category_id,subcategory_id,status)
VALUES ($1, $2, $3, $4, $5, 'OPEN')
RETURNING id, title, status, description, severity_id, category_id, subcategory_id, created_at, updated_at, completed_at, user_id
`

type CreateTicketParams struct {
	Title         string
	Description   string
	SeverityID    int32
	CategoryID    int32
	SubcategoryID sql.NullInt32
}

func (q *Queries) CreateTicket(ctx context.Context, arg CreateTicketParams) (Ticket, error) {
	row := q.db.QueryRowContext(ctx, createTicket,
		arg.Title,
		arg.Description,
		arg.SeverityID,
		arg.CategoryID,
		arg.SubcategoryID,
	)
	var i Ticket
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.Status,
		&i.Description,
		&i.SeverityID,
		&i.CategoryID,
		&i.SubcategoryID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.CompletedAt,
		&i.UserID,
	)
	return i, err
}

const deleteTicket = `-- name: DeleteTicket :exec
DELETE FROM tickets
WHERE id = $1
`

func (q *Queries) DeleteTicket(ctx context.Context, id int32) error {
	_, err := q.db.ExecContext(ctx, deleteTicket, id)
	return err
}

const getTicketById = `-- name: GetTicketById :one
SELECT tickets.id, tickets.title, tickets.status, tickets.description, tickets.severity_id, tickets.category_id, tickets.subcategory_id, tickets.created_at, tickets.updated_at, tickets.completed_at, tickets.user_id, category.name as category_name, subcategory.name as subcategory_name
FROM tickets
JOIN categories category on tickets.category_id = category.id
LEFT JOIN categories subcategory on tickets.subcategory_id = subcategory.id
WHERE tickets.id = $1
`

type GetTicketByIdRow struct {
	ID              int32
	Title           string
	Status          string
	Description     string
	SeverityID      int32
	CategoryID      int32
	SubcategoryID   sql.NullInt32
	CreatedAt       time.Time
	UpdatedAt       time.Time
	CompletedAt     sql.NullTime
	UserID          sql.NullInt32
	CategoryName    string
	SubcategoryName sql.NullString
}

func (q *Queries) GetTicketById(ctx context.Context, id int32) (GetTicketByIdRow, error) {
	row := q.db.QueryRowContext(ctx, getTicketById, id)
	var i GetTicketByIdRow
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.Status,
		&i.Description,
		&i.SeverityID,
		&i.CategoryID,
		&i.SubcategoryID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.CompletedAt,
		&i.UserID,
		&i.CategoryName,
		&i.SubcategoryName,
	)
	return i, err
}

const listTickets = `-- name: ListTickets :many
SELECT id, title, status, description, severity_id, category_id, subcategory_id, created_at, updated_at, completed_at, user_id
FROM tickets
`

func (q *Queries) ListTickets(ctx context.Context) ([]Ticket, error) {
	rows, err := q.db.QueryContext(ctx, listTickets)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []Ticket{}
	for rows.Next() {
		var i Ticket
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Status,
			&i.Description,
			&i.SeverityID,
			&i.CategoryID,
			&i.SubcategoryID,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.CompletedAt,
			&i.UserID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateTicket = `-- name: UpdateTicket :exec
UPDATE tickets
SET title = COALESCE($2, title),
    description  = COALESCE($3, description),
    user_id      = COALESCE($4, user_id),
    severity_id      = COALESCE($5, severity_id),
    category_id      = COALESCE($6, category_id),
    subcategory_id      = COALESCE($7, subcategory_id),
    status        = COALESCE($8, status),
    updated_at = NOW()
WHERE id = $1
`

type UpdateTicketParams struct {
	ID            int32
	Title         sql.NullString
	Description   sql.NullString
	UserID        sql.NullInt32
	SeverityID    sql.NullInt32
	CategoryID    sql.NullInt32
	SubcategoryID sql.NullInt32
	Status        sql.NullString
}

func (q *Queries) UpdateTicket(ctx context.Context, arg UpdateTicketParams) error {
	_, err := q.db.ExecContext(ctx, updateTicket,
		arg.ID,
		arg.Title,
		arg.Description,
		arg.UserID,
		arg.SeverityID,
		arg.CategoryID,
		arg.SubcategoryID,
		arg.Status,
	)
	return err
}
