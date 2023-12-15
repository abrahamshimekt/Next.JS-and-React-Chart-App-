import React from 'react'

interface TemplateStatusTagProps {
    status: string, 
}
const TemplateStatusBadge : React.FC<TemplateStatusTagProps>= ({status}) => {
  return (
    
    <div className='flex justify-center bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'>
        {status }      
    </div>
  )
}

export default TemplateStatusBadge
