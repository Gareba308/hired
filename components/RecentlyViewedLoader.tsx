import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const RecentlyViewedLoader = () => {
  return (
  <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f9fafb">
    <div>
        <div className='w-full mt-2 pr-4'>
          <div><Skeleton height={18} count={4} className='rounded-md'/></div>
        </div>
      </div> 
    </SkeletonTheme>
  )
}

export default RecentlyViewedLoader;