import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/frontend_assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const PlaceOrder = () => {

  const [method, setMethod] = useState("cod");
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    doorNo: "",
    town: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    phone: ""
  })

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {

      let orderItems = []

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      switch (method) {
        case 'cod':
          const res = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
          if (res.data.success) {
            setCartItems({});
            navigate('/orders');
            toast.success(res.data.message)
          }
          else {
            toast.error(res.data.message)
          }
          break;

        case 'stripe':
          const resStripe = await axios.post(backendUrl + "/api/order/stripe", orderData, { headers: { token } });
          if (resStripe.data.success) {
            const { session_url } = resStripe.data;
            window.location.replace(session_url)
          }
          else {
            toast.error(resStripe.data.message)
          }
          break;

        case 'razorpay':
          const responseRazorpay = await axios.post(
            backendUrl + '/api/order/razorpay',
            { ...orderData, userId: token.userId },
            { headers: { token } }
          );

          if (responseRazorpay.data.success) {
            const { razorpayOrder, orderId } = responseRazorpay.data;

            const options = {
              key: import.meta.env.VITE_RAZORPAY_KEY_ID, // your key from env
              amount: razorpayOrder.amount,
              currency: 'INR',
              name: 'Green Trendz',
              description: 'Order Payment',
              order_id: razorpayOrder.id,
              handler: async function (response) {
                const verifyRes = await axios.post(
                  backendUrl + '/api/order/verify-razorpay',
                  { userId: token.userId, items: orderItems, amount: getCartAmount(), address: formData },
                  { headers: { token } }
                );
                if (verifyRes.data.success) {
                  toast.success("Payment successful!");
                  setCartItems({});
                  navigate('/orders');
                } else {
                  toast.error("Payment verification failed!");
                }
              },
              prefill: {
                name: formData.firstName + " " + formData.lastName,
                email: "test@example.com",
                contact: formData.phone,
              },
              theme: {
                color: '#000000',
              },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
          } else {
            toast.error(responseRazorpay.data.message);
          }
          break;

        default:
          break
      }

    } catch (error) {
      console.log(error.message)
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

      {/* Left side */}

      <div className='flex flex-col gap-4 w-full sm:max-w-[450px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" placeholder='First Name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" placeholder='Last Name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <input required onChange={onChangeHandler} name='doorNo' value={formData.doorNo} type="text" placeholder='Door Number' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <input required onChange={onChangeHandler} name='town' value={formData.town} type="text" placeholder='Town' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} type="text" placeholder='Street' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} type="text" placeholder='City' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} type="text" placeholder='State' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} type="number" placeholder='Zipcode' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input required onChange={onChangeHandler} name='phone' value={formData.phone} type="number" placeholder='Phone Number' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
      </div>

      {/* Right Side */}

      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />

          {/* Payment Selection method */}

          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? "bg-green-400" : ""}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? "bg-green-400" : ""}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="razorpay" />
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>

        </div>

      </div>

    </form>
  )
}

export default PlaceOrder