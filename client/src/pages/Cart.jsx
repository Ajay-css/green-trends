import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const productId in cartItems) {
        for (const sizeKey in cartItems[productId]) {
          if (cartItems[productId][sizeKey] > 0) {
            tempData.push({
              _id: productId,
              size: sizeKey,
              quantity: cartItems[productId][sizeKey],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);
          const selectedSize = productData?.sizes?.find((s) => s.size === item.size);

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              {/* Product Info */}
              <div className="flex items-start gap-6">
                <img src={productData.image[0]} alt="" className="w-16 sm:w-20" />
                <div>
                  <p className="text-xs sm:text-lg font-medium">{productData.name}</p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency} {selectedSize ? selectedSize.price : productData.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-500 text-white">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity Input */}
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > 0) {
                    updateQuantity(item._id, item.size, val);
                  }
                }}
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
              />

              {/* Delete Button */}
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                src={assets.bin_icon}
                alt="remove"
                className="w-4 mr-4 sm:w-5 cursor-pointer"
              />
            </div>
          );
        })}
      </div>

      {/* Checkout Section */}
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate('/place-order')}
              className="bg-black text-white text-sm my-8 px-8 py-3 cursor-pointer"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;