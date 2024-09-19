import React from 'react'
import javascript from '../assets/javascript.png'
import { Button } from 'flowbite-react'

const CallToAction = () => {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
      <div className='flex-1 justify-center flex flex-col'>
        <h2 className='text-2xl'>Want to learn more about Javascript?</h2>
        <p className='text-gray-500'>Checkout these resources with 100 Javascript Projects</p>
        <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'>
          <a href="https://www.github.com/keshavyadav5" target='_blank' rel='noopener noreferrer'>Learn more</a>
        </Button>
      </div>
      <div className='flex-1'>
        <img src={javascript} alt="photo/javascript" />
      </div>
    </div>
  )
}

export default CallToAction 