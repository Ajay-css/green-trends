import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/frontend_assets/assets.js'
import { NavLink, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext.jsx';
import toast from 'react-hot-toast';

const Navbar = () => {

    const [visible, setVisible] = useState(false);

    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

    const logout = () => {
        localStorage.removeItem('token');
        setToken("")
        setCartItems({})
        toast.success('Logged Out Successfully')
        navigate('/login')
    }

    return (
        <div className='flex items-center justify-between font-medium'>
            <Link to={'/'} className='flex items-center py-3'>
                <span className='text-[30px]'><span className="text-green-500">G</span><span className='text-green-400'>reen</span> <span className='text-blue-500'>T</span><span className="text-blue-400">rend'z</span></span>
            </Link>
            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
                <NavLink to={'/'} className='flex flex-col items-center gap-1'>
                    <p>HOME</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to={'/collection'} className='flex flex-col items-center gap-1'>
                    <p>COLLECTIONS</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to={'/about'} className='flex flex-col items-center gap-1'>
                    <p>ABOUT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to={'/contact'} className='flex flex-col items-center gap-1'>
                    <p>CONTACT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
            </ul>

            <div className="flex items-center gap-6">
                <img onClick={() => setShowSearch(true)} src={assets.search_icon} alt="" className='w-5 cursor-pointer' />
                <div className="group relative">
                    <img onClick={() => token ? null : navigate('/login')} src={assets.profile_icon} alt="" className='w-5 cursor-pointer' />
                    {
                        token && <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                                <p className='cursor-pointer hover:text-black'>My Profile</p>
                                <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Ordrers</p>
                                <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
                            </div>
                        </div>
                    }
                </div>
                <Link to={'/cart'} className='relative'>
                    <img src={assets.cart_icon} alt="" className='w-5 min-w-5' />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                </Link>
                <img onClick={() => setVisible(true)} src={assets.menu_icon} alt="" className='w-5 cursor-pointer sm:hidden' />
            </div>

            {/* Sidebar for small menu screen */}

            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className="flex flex-col text-gray-600">
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img src={assets.dropdown_icon} alt="" className='h-4 rotate-180' />
                        <p>Back</p>
                    </div>
                    <NavLink className={'py-2 pl-6 border'} onClick={() => setVisible(false)} to={'/'}>HOME</NavLink>
                    <NavLink className={'py-2 pl-6 border'} onClick={() => setVisible(false)} to={'/collection'}>COLLECTIONS</NavLink>
                    <NavLink className={'py-2 pl-6 border'} onClick={() => setVisible(false)} to={'/about'}>ABOUT</NavLink>
                    <NavLink className={'py-2 pl-6 border'} onClick={() => setVisible(false)} to={'/contact'}>CONTACT</NavLink>
                </div>
            </div>

        </div>
    )
}

export default Navbar