import React, { useState } from 'react'

export default function DeleteFile() {
  const [filename, setFilename] = useState('')

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/filedel/${filename}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.text()
        alert(result)
        setFilename('')
      } else {
        alert('Delete failed')
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Error deleting file')
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg mt-4 p-6">
      <h2 className="text-2xl font-bold mb-4">Delete File</h2>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Enter filename to delete"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button onClick={handleDelete} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Delete</button>
      </div>
    </div>
  )
}