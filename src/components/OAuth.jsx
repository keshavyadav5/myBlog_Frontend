import React from 'react';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from "react-icons/ai";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { signInFailure, signInStart, signInSuccess } from '../redux/userSlice';
import { ENV } from '../config/env';

const OAuth = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      dispatch(signInStart());
      const result = await signInWithPopup(auth, provider);

      const res = await axios.post(`${ENV.BACKEND_URL}/api/auth/google`, {
        name: result.user.displayName,
        email: result.user.email,
        googlePhotoUrl: result.user.photoURL,
      });

      if (res.data.success === false) {
        dispatch(signInFailure(res.data.message));
        toast.error(res.data.message);
        return;
      }

      console.log

      dispatch(signInSuccess(res.data));
      toast.success(res.data.message);
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
      console.log(error);
    }
  };

  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
      <AiFillGoogleCircle className='w-6 h-6 mr-2' />
      Continue with Google
    </Button>
  );
};

export default OAuth;
