import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import axios from 'axios'
import { toast } from 'react-toastify'
import OAuth from '../components/OAuth';
import { ENV } from '../config/env'

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  }
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await axios.post(
        `${ENV.BACKEND_URL}/api/auth/signup`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );
      setLoading(false)
      toast.success(res.data.message);
      navigate('/sign-in');
    } catch (error) {
      const errMessage = error.response?.data?.message || "Internal server error";
      toast.error(errMessage)
      setLoading(false)
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
              <Label value='Your name' />
              <TextInput type='text' placeholder="Username" id='username' required onChange={handleChange} />
            </div>
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
                loading ? <Spinner size='sm' /> : 'Sign Up'
              }
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-3'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500 underline'>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup