import React from 'react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default function TableView({ rows }) {
  const open = (url) => {
    if (url) {
      window.open(url, '_blank')
    } else {
      alert('Link not available')
    }
  }

  // <-- Replace your existing downloadExcel function with this
  const downloadExcel = () => {
    if (!rows || rows.length === 0) {
      alert('No data to download');
      return;
    }

    // Prepare worksheet data with clickable links
    const worksheetData = rows.map((r) => ({
      'Product Name': r['Product Name'],
      'Module Name': r['Module Name'],
      'Guide Name': r['Guide Name'],
      'API Name': r['API Name'],
      'Video': r['Video Link'] ? { f: `HYPERLINK("${r['Video Link']}", "Video")` } : '',
      'Step Guide': r['Step Link'] ? { f: `HYPERLINK("${r['Step Link']}", "Step Guide")` } : '',
      'Simulation': r['Simulation Link'] ? { f: `HYPERLINK("${r['Simulation Link']}", "Simulation")` } : ''
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData, { skipHeader: false });

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Guides');

    // Write workbook and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'TableData.xlsx');
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <button 
        onClick={downloadExcel} 
        style={{ marginBottom: '10px', padding: '6px 12px', cursor: 'pointer' }}
      >
        Download Excel
      </button>

      <table className="data-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Module Name</th>
            <th>Guide Name</th>
            <th>API Name</th>
            <th>Video</th>
            <th>Step Guide</th>
            <th>Simulation</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r['Product Name']}</td>
              <td>{r['Module Name']}</td>
              <td>{r['Guide Name']}</td>
              <td>{r['API Name']}</td>

              <td>
                <button onClick={() => open(r['Video Link'])} disabled={!r['Video Link']}>
                  Video
                </button>
              </td>

              <td>
                <button onClick={() => open(r['Step Link'])} disabled={!r['Step Link']}>
                  Step Guide
                </button>
              </td>

              <td>
                <button onClick={() => open(r['Simulation Link'])} disabled={!r['Simulation Link']}>
                  Simulation
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
