import { useEffect, useMemo, useState } from 'react'
import PaperForm, { defaultPaper } from './components/PaperForm'
import PaperTable from './components/PaperTable'

function normalizeFormForApi(formData) {
  return {
    ...formData,
    year: formData.year === '' ? null : Number(formData.year),
    rating: formData.rating === '' ? null : Number(formData.rating),
    priority: formData.priority === '' ? null : Number(formData.priority),
    date_read: formData.date_read || null
  }
}

function toFormData(paper) {
  return {
    title: paper.title || '',
    authors: paper.authors || '',
    year: paper.year || '',
    venue: paper.venue || '',
    doi: paper.doi || '',
    url: paper.url || '',
    pdf_path: paper.pdf_path || '',
    status: paper.status || 'to_read',
    date_read: paper.date_read ? String(paper.date_read).slice(0, 10) : '',
    rating: paper.rating || '',
    priority: paper.priority || 3,
    tags: paper.tags || '',
    summary: paper.summary || '',
    notes: paper.notes || ''
  }
}

export default function App() {
  const [papers, setPapers] = useState([])
  const [formData, setFormData] = useState(defaultPaper)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')

  const loadPapers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/papers')
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load papers')
      }
      setPapers(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPapers()
  }, [])

  const filteredPapers = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return papers
    return papers.filter((paper) =>
      [paper.title, paper.authors, paper.tags, paper.summary, paper.notes, paper.venue]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(q))
    )
  }, [papers, filter])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setSaving(true)
      const payload = normalizeFormForApi(formData)
      const url = editingId ? `/api/papers/${editingId}` : '/api/papers'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Save failed')
      }

      if (editingId) {
        setPapers((prev) => prev.map((paper) => (paper.id === editingId ? data : paper)))
      } else {
        setPapers((prev) => [data, ...prev])
      }

      setFormData(defaultPaper)
      setEditingId(null)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (paper) => {
    setEditingId(paper.id)
    setFormData(toFormData(paper))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this paper?')
    if (!confirmed) return

    try {
      const response = await fetch(`/api/papers/${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Delete failed')
      }
      setPapers((prev) => prev.filter((paper) => paper.id !== id))
      if (editingId === id) {
        setEditingId(null)
        setFormData(defaultPaper)
      }
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setFormData(defaultPaper)
  }

  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="mb-4">
            <h1 className="display-6 fw-semibold mb-2">Papers Database</h1>
            <p className="text-secondary mb-0">
              Track papers you want to read, what you have read, and your research notes.
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <PaperForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
            isEditing={Boolean(editingId)}
            saving={saving}
          />

          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <div className="row g-3 align-items-center">
                <div className="col-md-8">
                  <label className="form-label mb-1">Search</label>
                  <input
                    className="form-control"
                    placeholder="Search title, authors, tags, notes..."
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                  />
                </div>
                <div className="col-md-4 text-md-end">
                  <div className="text-secondary small">{filteredPapers.length} paper(s)</div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="alert alert-info">Loading papers...</div>
          ) : (
            <PaperTable papers={filteredPapers} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  )
}
