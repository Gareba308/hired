import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const ProfileLoading = () => {
  return (
  <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
    <div>
        <div>
          <Skeleton height={110}/>
        </div>
        <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6'>
          <div><Skeleton height={65} count={5}/></div>
          <div className='hidden sm:block'><Skeleton height={65} count={5}/></div>
        </div>
        <div className='mt-6'>
          <Skeleton height={110} count={1}/>
        </div>
      </div> 
    </SkeletonTheme>
  )
}

export default ProfileLoading