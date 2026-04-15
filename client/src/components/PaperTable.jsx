function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString()
}

function statusBadgeClass(status) {
  switch (status) {
    case 'read':
      return 'text-bg-success'
    case 'reading':
      return 'text-bg-primary'
    case 'important':
      return 'text-bg-warning'
    case 'skip':
      return 'text-bg-secondary'
    default:
      return 'text-bg-light'
  }
}

export default function PaperTable({ papers, onEdit, onDelete }) {
  if (papers.length === 0) {
    return (
      <div className="alert alert-light border shadow-sm">
        No papers yet. Add one above to get started.
      </div>
    )
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Paper</th>
                <th>Status</th>
                <th>Year</th>
                <th>Priority</th>
                <th>Date Read</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {papers.map((paper) => (
                <tr key={paper.id}>
                  <td>
                    <div className="fw-semibold">{paper.title}</div>
                    <div className="text-muted small">{paper.authors || 'No authors listed'}</div>
                    {paper.tags && <div className="small mt-1">Tags: {paper.tags}</div>}
                    {paper.summary && <div className="small mt-1 text-secondary">{paper.summary}</div>}
                  </td>
                  <td>
                    <span className={`badge ${statusBadgeClass(paper.status)}`}>
                      {paper.status}
                    </span>
                  </td>
                  <td>{paper.year || ''}</td>
                  <td>{paper.priority || ''}</td>
                  <td>{formatDate(paper.date_read)}</td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary" onClick={() => onEdit(paper)}>
                        Edit
                      </button>
                      <button className="btn btn-outline-danger" onClick={() => onDelete(paper.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
