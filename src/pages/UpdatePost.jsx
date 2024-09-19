import React, { useState, useRef, useEffect } from 'react';
import { Button, FileInput, Select, TextInput } from 'flowbite-react';
import { Alert } from 'flowbite-react'; // Import Alert component
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams} from 'react-router-dom';
import { uploadPostStart, uploadPostFailure, uploadPostSuccess } from '../redux/userSlice';
import { ENV } from '../config/env'

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const UpdatePost = () => {
  const [data, setData] = useState({});
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const quillRef = useRef(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { postId } = useParams()
  const { currentUser } = useSelector(state => state.user)


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${ENV.BACKEND_URL}/api/post/getposts?postId=${postId}`, {
          withCredentials: true,
        });
  
        if (res.data.posts.length > 0) {
          setData(res.data.posts[0]); 
        } else {
          toast.error("Post not found");
        }
      } catch (error) {
        toast.error("Unable to load post");
        console.log(error.message);
      }
    };
  
    fetchPost();
  }, [postId]);
  
  

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

  const handleUploadImage = async () => {
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
      const errMessage = error.response?.data?.message || "Internal server error";
      toast.error(errMessage)
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.put(
        `${ENV.BACKEND_URL}/api/post/updatepost/${data._id}/${currentUser._id}`,
        {
          title: data.title,
          content: data.content,
          category: data.category,
          image: data.image,
        },
        {
          withCredentials: true,
        }
      );
  
      if (!res.data.success) {
        toast.error("Invalid data or something went wrong");
        return;
      }
  
      toast.success("Post updated successfully");
      navigate(`/postpage/${data.slug}`);
    } catch (error) {
      const errMessage = error.response?.data?.message || "Internal server error";
      toast.error(errMessage)
    }
  };
  

  
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update Post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={handleChange}
            value={data?.title || ''}
          />
          <Select
            className='flex-1'
            id='category'
            required
            onChange={handleChange}
            value={data?.category || ''}
          >
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
            onClick={handleUploadImage}
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
          value={data?.content || ''}
        />
        <Button type='submit' gradientDuoTone='purpleToPink'>Update</Button>
      </form>
    </div>
  );
};

export default UpdatePost;
