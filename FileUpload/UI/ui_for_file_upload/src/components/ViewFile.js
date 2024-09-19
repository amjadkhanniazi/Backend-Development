import React, { useState } from 'react'

export default function ViewFile() {
  const [filename, setFilename] = useState('')
  const [fileUrl, setFileUrl] = useState('')

  const handleView = async () => {
    try {
      const response = await fetch(`http://localhost:5000/files/${filename}`)
      console.log(response);
      
      if (response.ok) {
        setFileUrl(response.url)
      } else {
        alert('File not found')
      }
    } catch (error) {
      console.error('Error viewing file:', error)
      alert('Error viewing file')
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg mt-4 p-6">
      <h2 className="text-2xl font-bold mb-4">View File</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Enter filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button onClick={handleView} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View</button>
      </div>
      {fileUrl && (
        <div className="mt-4">
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Open File
          </a>
        </div>
      )}
    </div>
  )
}