import React from 'react'

const Table = ({
    columns,
    renderRow,
    data
}:{
    columns:{header: string, accessor: string, className?: string}[]
    renderRow: (item: any) => React.ReactNode 
    data:any[] 
 } ) => {
  return (
    <table className='w-full mt-4'>
        <thead>
            <tr className='text-left text-stone-600 text-sm'>
                {columns.map((item) => (
                    <th key={item.accessor} className={item.className} >{item.header}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {data.map((item) => renderRow(item))}
        </tbody>
    </table>
  )
}

export default Table
