import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import axios from 'axios'
import PostCard from '../components/PostCard'
import { ENV } from '../config/env'

const Home = () => {
  const [posts, setPosts] = useState([])

  useEffect(()=>{
    const fetchPost = async () =>{
      const res = await axios.get(`${ENV.BACKEND_URL}/api/post/getposts`,{
        withCredentials : true
      })
      setPosts(res.data.posts)
    }
    fetchPost()
  },[])
  return (
    <div>
      <div className="flex flex-col p-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>  
        <p className='text-gray-600 text-xs lg:text-sm mt-5'>Here you'll fina a variety of articles and tutorials on topics such as web development, software engineering, and programming languages.</p>
        <Link to='/search' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline mt-5'>View all posts</Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction/>
      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {
          posts && posts.length > 0 && (
            <div>
              <h2 className='text-2xl font-semibold text-center my-4'>Recents Posts</h2>
              <div className='flex flex-wrap gap-4 w-full items-center justify-center'>
                {posts.map((post, index) => (
                  <PostCard key={post._id} post={post}/>
                ))}
              </div>
            </div>
          )
        }
        <Link to='/search' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline mt-5 self-center'>View all posts</Link>
      </div>
    </div>
  )
}

export default Home