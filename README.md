# Papers Database App

A simple full-stack papers manager built from the provided React + Express scaffold.

## Features

- React frontend with Bootstrap styling
- Express backend with MariaDB/MySQL connection
- CRUD API for papers
- Search by title, authors, tags, summary, notes, or venue
- Bash script to create the `papers` table

## Project Structure

- `client/` - Vite + React frontend
- `server/` - Express backend
- `server/scripts/create_papers_table.sh` - creates the papers table

## Setup

### 1. Server

```bash
cd server
cp .env.example .env
npm install
```

Edit `server/.env` and fill in your actual password.

Example:

```env
PORT=4101
DB_HOST=localhost
DB_USER=skonjp
DB_PASSWORD=your_real_password
DB_NAME=db_skon
```

Create the table:

```bash
cd server/scripts
./create_papers_table.sh
```

Start the server:

```bash
cd ../
npm install
npm start
```

### 2. Client

```bash
cd client
npm install
npm run dev
```

## API Routes

- `GET /api/status`
- `GET /api/papers`
- `GET /api/papers/:id`
- `POST /api/papers`
- `PUT /api/papers/:id`
- `DELETE /api/papers/:id`

## Notes

This project assumes the frontend is proxied to the backend in development or served behind the same host in deployment. If you run frontend and backend on different ports in development, add a Vite proxy or use a full API base URL.
