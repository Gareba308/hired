import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const EditorLoader = () => {
  return (
  <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f9fafb">
    <div>
        <div className='w-full mt-2 pr-4'>
          <div><Skeleton height={20} count={4}/></div>
        </div>
      </div> 
    </SkeletonTheme>
  )
}

export default EditorLoader;