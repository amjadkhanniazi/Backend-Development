import React, { useState } from 'react'

export default function AddFile() {
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.text()
        alert(result)
        setFile(null)
      } else {
        alert('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file')
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg mt-4 p-6">
      <h2 className="text-2xl font-bold mb-4">Add File</h2>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleUpload} disabled={!file} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">Upload</button>
    </div>
  )
}