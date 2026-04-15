import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from './db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4101

app.use(cors())
app.use(express.json())

app.get('/api/status', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS server_time')
    res.json({ ok: true, serverTime: rows[0].server_time })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

app.get('/api/papers', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM papers
      ORDER BY
        CASE status
          WHEN 'reading' THEN 1
          WHEN 'to_read' THEN 2
          WHEN 'read' THEN 3
          WHEN 'important' THEN 4
          WHEN 'skip' THEN 5
          ELSE 6
        END,
        year DESC,
        created_at DESC
    `)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/papers/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM papers WHERE id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Paper not found' })
    }
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/papers', async (req, res) => {
  try {
    const {
      title,
      authors = '',
      year = null,
      venue = '',
      doi = '',
      url = '',
      pdf_path = '',
      status = 'to_read',
      date_read = null,
      rating = null,
      priority = 3,
      tags = '',
      summary = '',
      notes = ''
    } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const [result] = await pool.query(
      `INSERT INTO papers
      (title, authors, year, venue, doi, url, pdf_path, status, date_read, rating, priority, tags, summary, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        authors,
        year || null,
        venue,
        doi,
        url,
        pdf_path,
        status,
        date_read || null,
        rating || null,
        priority || 3,
        tags,
        summary,
        notes
      ]
    )

    const [rows] = await pool.query('SELECT * FROM papers WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/papers/:id', async (req, res) => {
  try {
    const {
      title,
      authors = '',
      year = null,
      venue = '',
      doi = '',
      url = '',
      pdf_path = '',
      status = 'to_read',
      date_read = null,
      rating = null,
      priority = 3,
      tags = '',
      summary = '',
      notes = ''
    } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const [result] = await pool.query(
      `UPDATE papers
       SET title = ?, authors = ?, year = ?, venue = ?, doi = ?, url = ?, pdf_path = ?,
           status = ?, date_read = ?, rating = ?, priority = ?, tags = ?, summary = ?, notes = ?
       WHERE id = ?`,
      [
        title.trim(),
        authors,
        year || null,
        venue,
        doi,
        url,
        pdf_path,
        status,
        date_read || null,
        rating || null,
        priority || 3,
        tags,
        summary,
        notes,
        req.params.id
      ]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Paper not found' })
    }

    const [rows] = await pool.query('SELECT * FROM papers WHERE id = ?', [req.params.id])
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/papers/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM papers WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Paper not found' })
    }
    res.json({ message: 'Paper deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
