import { GraduationCap, Hand, LayoutIcon, Settings } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function SideNav() {
  const menuList=[
    {
    id:1,
    name: "Dashboard",
    icon: LayoutIcon,
    path:'/dashboard'
  },
    {
    id:2,
    name: "Students",
    icon: GraduationCap,
    path:'/dashboard/students'
  },
    {
    id:3,
    name: "Attendence",
    icon: Hand,
    path:'/dashboard/attendence'
  },
    {
    id:4,
    name: "Settings",
    icon: Settings,
    path:'/dashboard/settings'
  },
]
  return (
    <div className='border-2 shadow-md h-screen p-5'>
      <Image src={"/logo.svg"} width={180} height={50} alt='logo'/>

      <hr className='my-5'></hr>
      {menuList.map((menu, index)=>(
        <h2>
          <menu.icon />
          {menu.name}
        </h2>
      ))}
    </div>
  )
}



