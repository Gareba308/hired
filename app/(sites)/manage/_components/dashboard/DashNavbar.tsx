import React from 'react'
import MobileSidebar from './MobileSidebar'
import DashNavbarRoutes from './DashNavbarRoutes'
import MobileLogo from './MobileLogo'

const DashNavbar = () => {
  return (
    <div className='p-4 border-b border-gray-200 h-full flex items-center bg-[#ffffff] md:bg-white/75 transition-all backdrop-blur-lg'>
        <MobileSidebar />
        <MobileLogo />
        <DashNavbarRoutes />
    </div>
  )
}

export default DashNavbar