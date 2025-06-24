import React from 'react'
import Header from './_components/AppHeader'

const DashboardLayout = ({children}) => {
  return (
    <div>
        <Header />
        <div className='px-10 md:px-20 lg:px-40 py-10'>
            {children}
        </div>
    </div>
  )
}

export default DashboardLayout