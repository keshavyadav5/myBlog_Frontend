import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Project from './pages/Project'
import Header from './components/Header'
import FooterComponent from './components/FooterComponent'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute'
import CreatePost from './pages/CreatePost'
import AdminPrivate from './components/AdminPrivate'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'
import ScrollToTop from './components/ScrollToTop'
import Search from './pages/Search'

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/search' element={<Search />} />
        <Route element={<PrivateRoute />} >
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<AdminPrivate />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route>
        <Route path='/project' element={<Project />} />
        <Route path='/postpage/:postSlug' element={<PostPage />} />
      </Routes>
      <ToastContainer position='top-center' />
      <FooterComponent />
      {/* {
      alert("you can try with admin id : keshav@gmail.com & password: 123")
    } */}
    </BrowserRouter>
  )
}

export default App