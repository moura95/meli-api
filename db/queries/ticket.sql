-- name: CreateTicket :one
INSERT INTO tickets (title,description,severity_id,status)
VALUES ($1, $2, $3, 'OPEN')
RETURNING *;


-- name: DeleteTicket :exec
DELETE FROM tickets
WHERE id = $1;

-- name: GetTicketById :one
SELECT *
FROM tickets
WHERE id = $1;

-- name: ListTickets :many
SELECT *
FROM tickets;

-- name: UpdateTicket :exec
UPDATE tickets
SET title = COALESCE(sqlc.narg('title'), title),
    description  = COALESCE(sqlc.narg('description'), description),
    severity_id      = COALESCE(sqlc.narg('severity_id'), severity_id),
    status        = COALESCE(sqlc.narg('status'), status),
    updated_at = NOW()
WHERE id = $1;