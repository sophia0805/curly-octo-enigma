import React from 'react'

const FilesView = () => {
  return (
    <div className='fileView'>
        <div className="fileView__raw">

        </div>
        <div className="filesView__titles">
            <div className="fileView__titles--left">
                <p>Name</p>
            </div>
            <div className="fileView__titles--right">
                <p>Last modified</p>
                <p>Files size</p>
            </div>
        </div>
        
    </div>
  )
}

export default FilesView