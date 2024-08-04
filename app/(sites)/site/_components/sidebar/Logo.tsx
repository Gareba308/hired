"use client"
import React from 'react'
import Image from 'next/image'

const Logo = () => {
  return (
    <div>
        <Image 
            height={130}
            width={130}
            alt='logo'
            src='/vercel.svg'
            quality={100}
        />
    </div>
  )
}

export default Logo