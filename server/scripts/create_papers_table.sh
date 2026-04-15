#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env file not found at $ENV_FILE"
  exit 1
fi

set -o allexport
source "$ENV_FILE"
set +o allexport

mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" <<'SQL'
CREATE TABLE IF NOT EXISTS papers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    authors TEXT,
    year INT,
    venue VARCHAR(255),
    doi VARCHAR(255),
    url TEXT,
    pdf_path TEXT,
    status ENUM('to_read', 'reading', 'read', 'important', 'skip') DEFAULT 'to_read',
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_read DATETIME NULL,
    rating INT NULL,
    priority INT DEFAULT 3,
    tags TEXT,
    summary TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
SQL

echo "Papers table created (or already exists)."
