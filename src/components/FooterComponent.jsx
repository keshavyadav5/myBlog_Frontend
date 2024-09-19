import React from 'react'
import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BsFacebook, BsInstagram, BsLinkedin } from "react-icons/bs";


const FooterComponent = () => {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mr-3 mb-4">
            <Link to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg cursor-pointer'>Keshav's</span>Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title='About' />
              <Footer.LinkGroup col >
                <Footer.Link
                  href='https://github.com/keshavyadav5/Note-app'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Note app project
                </Footer.Link>
                <Footer.Link
                  href='https://github.com/keshavyadav5/Basketball-React'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Basketball academy project
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Follow us' />
              <Footer.LinkGroup col >
                <Footer.Link
                  href='https://github.com/keshavyadav5'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Github
                </Footer.Link>
                <Footer.Link
                  href='#'
                >
                  Discard
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Follow us' />
              <Footer.LinkGroup col >
                <Footer.Link
                  href='h#'
                >
                  Privacy Policy
                </Footer.Link>
                <Footer.Link
                  href='#'
                >
                  Terms &amp; Condition
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className='flex flex-col justify-center items-center gap-3 sm:flex-row sm:justify-between'>
          <div className="">
            <Footer.Copyright href='#' by="Keshav's Blog" year={new Date().getFullYear()} />
          </div>
          <div className="flex gap-6">
            <Footer.Icon href='#' icon={BsFacebook} />
            <Footer.Icon href='https://www.instagram.com/k_shav09/' icon={BsInstagram} target='_blank' />
            <Footer.Icon href='https://www.linkedin.com/in/keshavyadav5/' icon={BsLinkedin} target='_blank' />
          </div>
        </div>
      </div>
    </Footer>
  )
}

export default FooterComponent