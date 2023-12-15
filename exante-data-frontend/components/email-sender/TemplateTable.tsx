import React from 'react'
import TemplateTableHeader from './TemplateTableHeader'
import TemplateTableBody from './TemplateTableBody'
import TemplateTableFooter from './TemplateTableFooter'


const TemplateTable = () => {
  return (
    <div className='flex flex-col w-full'>
        <TemplateTableHeader />
        <TemplateTableBody />
        <TemplateTableFooter />
    </div>
  )
}

export default TemplateTable;