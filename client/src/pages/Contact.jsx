import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import toast from 'react-hot-toast'

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img src={assets.contact_img} alt="" className='w-full md:max-w-[480px]' />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>3/6C, Munaiyaduvarv Nayanar Street<br /> Palayamkottai, Tirunelveli - 627002</p>
          <p className='text-gray-500'>Tell : (+91 9943066659) <br /> Email : greentrendztvl@gmail.com</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at Forever</p>
          <p className='text-gray-500'>Learn More About or Teams and Job Opening</p>
          <button onClick={() => toast.error('Vaccancies Already Filled', { icon: '😅' })} className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>

    </div>
  )
}

export default Contact