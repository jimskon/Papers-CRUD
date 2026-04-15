const defaultPaper = {
  title: '',
  authors: '',
  year: '',
  venue: '',
  doi: '',
  url: '',
  pdf_path: '',
  status: 'to_read',
  date_read: '',
  rating: '',
  priority: 3,
  tags: '',
  summary: '',
  notes: ''
}

export default function PaperForm({ formData, setFormData, onSubmit, onCancel, isEditing, saving }) {
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const clearForm = () => {
    setFormData(defaultPaper)
  }

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">{isEditing ? 'Edit Paper' : 'Add Paper'}</h2>
          {!isEditing && (
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={clearForm}>
              Clear
            </button>
          )}
        </div>

        <form onSubmit={onSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Title</label>
              <input className="form-control" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="col-md-8">
              <label className="form-label">Authors</label>
              <input className="form-control" name="authors" value={formData.authors} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Year</label>
              <input className="form-control" type="number" name="year" value={formData.year} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Venue</label>
              <input className="form-control" name="venue" value={formData.venue} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">DOI</label>
              <input className="form-control" name="doi" value={formData.doi} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">URL</label>
              <input className="form-control" name="url" value={formData.url} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">PDF Path</label>
              <input className="form-control" name="pdf_path" value={formData.pdf_path} onChange={handleChange} />
            </div>

            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                <option value="to_read">To Read</option>
                <option value="reading">Reading</option>
                <option value="read">Read</option>
                <option value="important">Important</option>
                <option value="skip">Skip</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Date Read</label>
              <input className="form-control" type="date" name="date_read" value={formData.date_read} onChange={handleChange} />
            </div>

            <div className="col-md-3">
              <label className="form-label">Rating</label>
              <input className="form-control" type="number" min="1" max="5" name="rating" value={formData.rating} onChange={handleChange} />
            </div>

            <div className="col-md-3">
              <label className="form-label">Priority</label>
              <input className="form-control" type="number" min="1" max="5" name="priority" value={formData.priority} onChange={handleChange} />
            </div>

            <div className="col-12">
              <label className="form-label">Tags</label>
              <input className="form-control" name="tags" value={formData.tags} onChange={handleChange} placeholder="AIED, tutoring, collaboration" />
            </div>

            <div className="col-12">
              <label className="form-label">Summary</label>
              <textarea className="form-control" rows="3" name="summary" value={formData.summary} onChange={handleChange} />
            </div>

            <div className="col-12">
              <label className="form-label">Notes</label>
              <textarea className="form-control" rows="5" name="notes" value={formData.notes} onChange={handleChange} />
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : isEditing ? 'Update Paper' : 'Create Paper'}
            </button>
            {isEditing && (
              <button className="btn btn-outline-secondary" type="button" onClick={onCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export { defaultPaper }
