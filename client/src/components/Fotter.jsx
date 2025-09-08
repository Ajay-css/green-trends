import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const Fotter = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div className=''>
                    <img src={assets.logo} alt="" className='mb-5 w-32' />
                    <p className='w-full md:w-2/3 text-gray-600'>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis maiores dolorem repellat omnis nulla quos consequuntur sit sequi aut doloremque odit voluptas repudiandae, repellendus natus aliquid illum provident magni soluta!
                    </p>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>Home</li>
                        <li>About</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>+91 9566318015</li>
                        <li>contact@foreveryou.com</li>
                    </ul>
                </div>

            </div>

            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2025@ .com - All Right Reserved.</p>
            </div>

        </div>
    )
}

export default Fotter