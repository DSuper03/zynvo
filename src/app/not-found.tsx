'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'


export default function NotFound() {
  return (
    <>
    <motion.div className='bg-black flex items-center justify-center'>
    <div style={{width: '6000px', height: '4000px', position: 'relative', overflow: 'hidden'}}>

  <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
     

    <Link href="/" className='text-black text-2xl mt-4'>Go Back Home</Link>
  </div>
  </div>
    </motion.div>
  </>
  )
}