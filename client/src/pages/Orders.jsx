import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import Title from '../components/Title'
import toast from 'react-hot-toast'

const Orders = () => {

  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([])

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }
      const res = await axios.post(backendUrl + "/api/order/userorders", {}, { headers: { token } });
      if (res.data.success) {
        let allOrdersItem = [];
        res.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {
    }
  }

  const cancelOrder = async (orderId) => {
    try {
      const res = await axios.post(backendUrl + '/api/order/deleteorder', { orderId }, { headers: { token } });
      if (res.data.success) {
        toast.success(res.data.message);;
        await loadOrderData();
      }
      else {
        toast.error(res.data.message)
      }
    } catch (error) {
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <div className='border-t pt-10'>

      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {
          orderData.map((item, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img src={item.image[0]} alt="" className='w-10 sm:w-20' />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                    <p>{currency} {item.price}</p>
                    <p>Quantity : {item.quantity}</p>
                    <p>Size : {item.size}</p>
                  </div>
                  <p className='mt-1'>Date : <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                  <p className='mt-1'>Payment : <span className='text-gray-400'>{item.paymentMethod}</span></p>
                </div>
              </div>

              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base'>{item.status}</p>
                </div>
                <button onClick={loadOrderData} className='border border-green-400 px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                {
                  item.status === 'Delivered'
                    ? <button onClick={loadOrderData} className='border border-red-500 px-4 py-2 text-sm font-medium rounded-sm'>Return Order</button>
                    : <button onClick={cancelOrder} className='border border-red-500 px-4 py-2 text-sm font-medium rounded-sm'>Cancel Order</button>
                }
              </div>
            </div>
          ))
        }
      </div>

    </div>
  )
}

export default Orders