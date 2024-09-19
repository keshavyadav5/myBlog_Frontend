import React, { useEffect } from 'react';
import { Avatar, Button, Dropdown, DropdownHeader, Navbar, TextInput, Toast } from 'flowbite-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../redux/ThemeSlice';
import axios from 'axios'
import { toast } from 'react-toastify';
import { signoutSuccess } from '../redux/userSlice';
import { ENV } from '../config/env';

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const path = useLocation().pathname;
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const { theme } = useSelector((state) => state.theme)
  const [searchTerm, setSearchTerm] = React.useState('')
  console.log(searchTerm);


  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);


  const handleSignout = async () => {
    try {
      const res = await axios.post(
        `${ENV.BACKEND_URL}/api/user/signout`,
        {},
        { withCredentials: true }
      );

      if (res.status !== 200) {
        toast.error('Error signing out');
      } else {
        toast.success('Signed out successfully');

        dispatch(signoutSuccess())
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className='border-b-2'>
      <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg cursor-pointer'>Keshav's</span>Blog
      </Link>

      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-2">
        <Button className='w-12 h-12 hidden lg:flex items-center justify-center' color='gray' pill onClick={() => dispatch(toggleTheme())}>
          {
            theme === 'light' ? <FaMoon /> : <FaSun />
          }
        </Button>

        {
          currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User"
                  img={currentUser?.profilePicture || currentUser?.rest?.profilePicture}
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <span className='block text-sm'>@{currentUser?.username || currentUser?.rest?.username}</span>
                <span className='block text-sm font-medium truncate'>{currentUser?.email || currentUser?.rest?.email}</span>
              </Dropdown.Header>
              <Link to={"/dashboard?tab=profile"} >
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>
          )
            :
            (
              <Link to='/sign-in'>
                <Button gradientDuoTone='purpleToBlue' outline>
                  <span className='text-sm'>Sign In</span>
                </Button>
              </Link>
            )
        }
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/project'} as={'div'}>
          <Link to='/project'>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
