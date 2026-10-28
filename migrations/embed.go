package migrations

import "embed"

// FS holds the SQL migrations compiled into the binary.
//
//go:embed *.sql
var FS embed.FS
