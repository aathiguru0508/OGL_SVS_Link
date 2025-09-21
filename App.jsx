import React, { useState } from 'react'
import axios from 'axios'

export default function App() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = (e) => {
    setFile(e.target.files[0])
    setError(null)
  }

  const upload = async (ev) => {
    ev.preventDefault()
    if (!file) {
      setError('Please choose an Excel file (.xlsx)')
      return
    }

    const form = new FormData()
    form.append('file', file)

    try {
      setLoading(true)
      const res = await axios.post('http://localhost:8000/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const rows = res.data.rows || []
      sessionStorage.setItem('ogl_table_data', JSON.stringify(rows))
      window.open('/viewer', '_blank')
    } catch (err) {
      console.error(err)
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data))
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>OGL Link Manager</h1>
      <form onSubmit={upload} className="upload-form">
        <label className="file-label">
          Choose Excel (.xlsx)
          <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
        </label>

        <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload & Open Table'}</button>
      </form>

      {error && <pre className="error">{error}</pre>}

      <div className="notes">
        <p>After upload the table will open in a new browser tab (Viewer).</p>
      </div>

      <hr />

      <a href="/viewer" target="_blank" rel="noreferrer">Open Viewer (if you already uploaded data)</a>
    </div>
  )
}
