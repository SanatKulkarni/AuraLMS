"use client"
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {

    const path=usePathname();
    useEffect(()=>{
        console.log(path)
    },[])
  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <Image src={'/logo.png'} width={160} height={100} alt='AuraLMS'/>
      <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-primary hover:font-bold transition-all
        cursor-pointer
        ${path=='/dashboard' && 'text-primary font-bold'}
        `}>Dashboard</li>
        <li className={`hover:text-primary hover:font-bold transition-all
        cursor-pointer
        ${path=='/dashboard/how' && 'text-primary font-bold'}
        `}>How It Works?</li>
      </ul>
      
    </div>
  )
}
export default Header