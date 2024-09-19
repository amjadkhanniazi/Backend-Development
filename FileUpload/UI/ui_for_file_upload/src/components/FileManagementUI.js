import React, { useState } from 'react'
import ViewFile from './ViewFile.js'
import AddFile from './AddFile.js'
import DeleteFile from './DeleteFile'
import ViewAllFiles from './ViewAllFiles'

export default function FileManagementUI() {
  const [activeComponent, setActiveComponent] = useState(null)

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <input type="text" placeholder="Search..." className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setActiveComponent('view')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View File</button>
          <button onClick={() => setActiveComponent('add')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add File</button>
          <button onClick={() => setActiveComponent('delete')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Delete File</button>
          <button onClick={() => setActiveComponent('viewAll')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View all Files</button>
        </div>
      </div>
      
      {activeComponent === 'view' && <ViewFile />}
      {activeComponent === 'add' && <AddFile />}
      {activeComponent === 'delete' && <DeleteFile />}
      {activeComponent === 'viewAll' && <ViewAllFiles />}
    </div>
  )
}