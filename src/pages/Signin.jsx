import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import axios from 'axios'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/userSlice';
import OAuth from '../components/OAuth';
import { ENV } from '../config/env'

const Signin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({})
  const { loading } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  }
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart())
      const res = await axios.post(
        `${ENV.BACKEND_URL}/api/auth/signin`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.success === false) {
        dispatch(signInFailure(res.data.message));
        toast.error(res.data.message);
        return;
      }
      dispatch(signInSuccess(res.data))
      toast.success(res.data.message);
      navigate('/');
    } catch (error) {
      const errMessage = error.response?.data?.message || "Internal server error";
      toast.error(errMessage)
      dispatch(signInFailure(error.message))
    }
  };


  return (
    <div className='min-h-screen mt-20'>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center md:justify-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg cursor-pointer'>Keshav's</span>Blog
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project. You can sign up with your name, eamil and password
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className='flex flex-col gap-4' onSubmit={handleOnSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput type='email' placeholder="email" id='email' required onChange={handleChange} />
            </div>
            <div>
              <Label value='Your Password' />
              <TextInput type='password' placeholder="**************" id='password' required onChange={handleChange} />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {
                loading ? <Spinner size='sm' /> : 'Sign In'
              }
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-3'>
            <span>Don't have an account?</span>
            <Link to='/sign-up' className='text-blue-500 underline'>Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signin


