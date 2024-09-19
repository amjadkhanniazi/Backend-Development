import React, { useState, useEffect } from 'react'

export default function ViewAllFiles() {
  const [files, setFiles] = useState([])

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:5000/gallery')
      if (response.ok) {
        const data = await response.json()
        // Filter out undefined or bad filenames
        const validFiles = data.filter(file => file)
        setFiles(validFiles)
      } else {
        alert('Failed to fetch files')
      }
    } catch (error) {
      console.error('Error fetching files:', error)
      alert('Error fetching files')
    }
  }

  const getFileName = (file) => {
    const fileName = file.split('/').pop()
    return fileName.length > 0 ? fileName : 'Unknown File'
  }

  const isImage = (file) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
    return imageExtensions.some(ext => file.toLowerCase().endsWith(ext))
  }

  return (
    <div className="bg-white shadow-md rounded-lg mt-4 p-6">
      <h2 className="text-2xl font-bold mb-4">All Files</h2>
      {files.length > 0 ? (
        <ul className="list-none pl-0">
          {files.map((file, index) => (
            <li key={index} className="mb-4">
              {isImage(file) ? (
                <div>
                  <img 
                    src={file} 
                    alt={getFileName(file)} 
                    className="w-32 h-32 object-cover mb-2" 
                  />
                  <p>{getFileName(file)}</p>
                </div>
              ) : (
                <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {getFileName(file)}
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No files found.</p>
      )}
    </div>
  )
}
