"use client"
import React from 'react'
import Image from 'next/image'

const Logo = () => {
  return (
    <div>
        <div className="w-28 h-28 flex-none items-center justify-center">
        <Image 
            height={128}
            width={128}
            alt='logo'
            src='/vercel.svg'
            quality={100}
        />
        </div>
    </div>
  )
}

export default Logo