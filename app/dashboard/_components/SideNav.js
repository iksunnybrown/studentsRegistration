"use client"
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { GraduationCap, Hand, LayoutIcon, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function SideNav() {
  const { user } = useKindeBrowserClient();

  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutIcon, path: '/dashboard' },
    { id: 2, name: "Students", icon: GraduationCap, path: '/dashboard/students' },
    { id: 3, name: "Attendence", icon: Hand, path: '/dashboard/attendence' },
    { id: 4, name: "Settings", icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <div className='border shadow-md h-screen p-5'>
      <Image src={"/logo.svg"} width={180} height={50} alt='logo' />

      <hr className='my-5' />

      {menuList.map((menu) => (
        <Link href={menu.path}>
        <h2 key={menu.id} className='flex items-center text-md p-4 gap-3 cursor-pointer hover:bg-amber-400 hover:text-white rounded-bl-full'>
          <menu.icon />
          {menu.name}
        </h2>
        </Link>
      ))}

      {user?.picture && (
        <div className='flex gap-2 items-center bottom-5 fixed p-4'>
          <Image src={user.picture} width={35} height={35} alt='user' className='rounded-full' />
          <div>
            <h2 className='text-sm font-bold'>
            {user?.given_name} {user?.family_name} </h2>
            <h2 className='text-xs text-slate-400'>{user?.email}</h2>
            </div>
        </div>
      )}
    </div>
  )
}
