import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [currState, setCurrState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currState === 'Sign Up') {
        const res = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (res.data.success) {
          // ✅ Correct token handling
          setToken(res.data.token);
          localStorage.setItem('token', res.data.token);
          toast.success('Account Created Successfully');
          navigate('/');
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (!res.data.success) {
          toast.error(res.data.message);
          return;
        }

        // ✅ Correct token handling
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        toast.success('Login Successful');
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Something went wrong. Please try again!');
    }
  };

  // ✅ Corrected useEffect dependency
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currState === 'Sign Up' && (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Name"
          required
        />
      )}

      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />

      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot Your Password</p>
        {currState === 'Login' ? (
          <p className="cursor-pointer" onClick={() => setCurrState('Sign Up')}>
            Create Account
          </p>
        ) : (
          <p className="cursor-pointer" onClick={() => setCurrState('Login')}>
            Login Here
          </p>
        )}
      </div>

      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currState === 'Login' ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  );
};

export default Login;