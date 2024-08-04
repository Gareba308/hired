"use client"
import React from 'react'
import SidebarRoutes from './SidebarRoutes'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'

const Sidebar = () => {
  const router= useRouter()
  const pathname= usePathname()
  const isActive= (
    pathname?.includes('/manage/settings')
)
  return (
    <>
    <div className='h-full flex flex-col border-r  bg-white shadow-sm'>
        <div className='p-6'>
            <h2 className='text-2xl font-bold text-slate-600'>Employer</h2>
        </div>
        <div className='flex flex-col w-full'>
          <SidebarRoutes />
        </div>
    </div>

    <div className=' flex flex-col border-r  bg-zinc-200/60 shadow-sm'>
    <div className='flex flex-col w-full'>
      <button type='button' onClick={()=>router.push('/manage/settings')} className={cn("flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 pt-6 pb-6 transition-all hover:text-slate-700 hover:bg-slate-300/20", isActive && "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700")}>
        <Settings 
            size={22}
            className={cn("text-slate-500", isActive && "text-sky-700")}
        />
        <div>Settings</div>
      </button>
    </div>
    </div>
    </>
  )
}

export default Sidebar