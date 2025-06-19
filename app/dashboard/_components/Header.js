"use client"

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import Image from 'next/image';
import React from 'react'

export default function header() {
  const{user}=useKindeBrowserClient();
  return (
    <div className='p-4 shadow-sm border flex justify-between'>
      <div className='mx-auto'>
        <h2 className='text-center items-center font-bold text-4xl'>Students Registration Management</h2>
      </div>
      <div>
        <Image src={user?.picture} 
        width={35} 
        height={35} alt='user' 
        className='rounded-full'/>
      </div>
    </div>
  )
}
