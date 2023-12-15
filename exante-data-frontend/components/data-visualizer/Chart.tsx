'use client'
import React from 'react'
import { ColumnChart } from 'react-chartkick';
import 'chartkick/chart.js'

type dataType = {
  data: any
}

const Chart = ({data}: dataType) => {
  const newData = [{name: data.name, data: data.data}]
  return (
    <div className='padding-container max-container w-full'>
        <ColumnChart data={newData} />
    </div>
  )
  
}

export default Chart
