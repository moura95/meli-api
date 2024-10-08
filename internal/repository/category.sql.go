// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: category.sql

package repository

import (
	"context"
	"database/sql"
)

const createCategory = `-- name: CreateCategory :one
INSERT INTO categories (name,parent_id)
VALUES ($1, $2)
RETURNING id, name, parent_id
`

type CreateCategoryParams struct {
	Name     string
	ParentID sql.NullInt32
}

func (q *Queries) CreateCategory(ctx context.Context, arg CreateCategoryParams) (Category, error) {
	row := q.db.QueryRowContext(ctx, createCategory, arg.Name, arg.ParentID)
	var i Category
	err := row.Scan(&i.ID, &i.Name, &i.ParentID)
	return i, err
}

const deleteCategory = `-- name: DeleteCategory :exec
DELETE FROM categories
WHERE id = $1
`

func (q *Queries) DeleteCategory(ctx context.Context, id int32) error {
	_, err := q.db.ExecContext(ctx, deleteCategory, id)
	return err
}

const getCategoryById = `-- name: GetCategoryById :one
SELECT id, name, parent_id
FROM categories
WHERE categories.id = $1
`

func (q *Queries) GetCategoryById(ctx context.Context, id int32) (Category, error) {
	row := q.db.QueryRowContext(ctx, getCategoryById, id)
	var i Category
	err := row.Scan(&i.ID, &i.Name, &i.ParentID)
	return i, err
}

const listCategories = `-- name: ListCategories :many
SELECT id, name, parent_id
FROM categories
`

func (q *Queries) ListCategories(ctx context.Context) ([]Category, error) {
	rows, err := q.db.QueryContext(ctx, listCategories)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []Category{}
	for rows.Next() {
		var i Category
		if err := rows.Scan(&i.ID, &i.Name, &i.ParentID); err != nil {
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

const listSubCategories = `-- name: ListSubCategories :many
SELECT id, name, parent_id
FROM categories
WHERE  parent_id = $1
`

func (q *Queries) ListSubCategories(ctx context.Context, parentID sql.NullInt32) ([]Category, error) {
	rows, err := q.db.QueryContext(ctx, listSubCategories, parentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []Category{}
	for rows.Next() {
		var i Category
		if err := rows.Scan(&i.ID, &i.Name, &i.ParentID); err != nil {
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

const updateCategory = `-- name: UpdateCategory :exec
UPDATE categories
SET name = COALESCE($2, name),
    parent_id  = COALESCE($3, parent_id)
WHERE id = $1
`

type UpdateCategoryParams struct {
	ID       int32
	Name     sql.NullString
	ParentID sql.NullInt32
}

func (q *Queries) UpdateCategory(ctx context.Context, arg UpdateCategoryParams) error {
	_, err := q.db.ExecContext(ctx, updateCategory, arg.ID, arg.Name, arg.ParentID)
	return err
}
