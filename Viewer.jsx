import React, { useEffect, useState } from 'react'
import TableView from './components/TableView'

export default function Viewer() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('ogl_table_data')
      if (raw) setRows(JSON.parse(raw))
    } catch (e) {
      console.error('Failed to load table data from sessionStorage', e)
    }
  }, [])

  return (
    <div className="viewer">
      <h2>Uploaded Table — Viewer</h2>
      {rows.length === 0 ? (
        <div>No data found in sessionStorage. Upload first from the main page.</div>
      ) : (
        <TableView rows={rows} />
      )}
    </div>
  )
}
