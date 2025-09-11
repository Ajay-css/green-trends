import React from 'react'
import { assets } from '../assets/assets.js'
import toast from 'react-hot-toast'

const Navbar = ({ setToken }) => {
    return (
        <div className='flex items-center py-2 px-[4%] justify-between'>
            <p className='w-[max(30%,80px)]'><span className='text-[26px] mr-2'><span className="text-green-500">G</span><span className='text-green-400'>reen</span> <span className='text-blue-500'>T</span><span className="text-blue-400">rend'z</span></span> Admin Panel</p>
            <button onClick={() => { setToken(""), toast.success('Logged Out Successfully') }} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
        </div>
    )
}

export default Navbar