import React, { useState, useRef } from 'react';
import { Button, FileInput, Select, TextInput } from 'flowbite-react';
import { Alert } from 'flowbite-react'; // Import Alert component
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadPostStart, uploadPostFailure, uploadPostSuccess } from '../redux/userSlice';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ENV } from '../config/env';

const CreatePost = () => {
  const [data, setData] = useState({});
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const quillRef = useRef(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setData({
      ...data, [e.target.id]: e.target.value
    });
  };

  const handleQuillChange = (value) => {
    setData({
      ...data, content: value
    });
  };

  const handleUpdloadImage = async () => {
    
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setData({ ...data, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(uploadPostStart())
    try {
      const res = await axios.post(`${ENV.BACKEND_URL}/api/post/create`, {
        title: data.title,
        content: data.content,
        category: data.category,
        image: data.image
      }, {
        withCredentials: true
      });

      console.log(res);
       
      if(res.data.success === false){
        dispatch(uploadPostFailure(res.data.message))
        toast.error("Invalid title or something went wrong")
      }
      dispatch(uploadPostSuccess(res.data))
      toast.success("Post created successfully")
      navigate('/')
    } catch (error) {
      const errMessage = error.response?.data?.message || "Internal server error";
      toast.error(errMessage)
      dispatch(uploadPostFailure(error.message))
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a Post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={handleChange}
          />
          <Select className='flex-1' id='category' required onClick={handleChange}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
             {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {data?.image && (
          <img
            src={data?.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          ref={quillRef}
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          id='content'
          required
          onChange={handleQuillChange}
        />
        <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button>
      </form>
    </div>
  );
};

export default CreatePost;