import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import axios from 'axios';
import { ENV } from '../config/env';

const DashComment = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  const [totalComments, setTotalComments] = useState(0); 

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${ENV.BACKEND_URL}/api/comment/getAllComment`, {
          withCredentials: true
        });
        setComments(res.data.comments);
        setTotalComments(res.data.totalComments); 
        if (res.data.comments.length >= res.data.totalComments) {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser?.rest?.isAdmin) {
      fetchComments();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await axios.get(`${ENV.BACKEND_URL}/api/comment/getAllComment?startIndex=${startIndex}`, {
        withCredentials: true
      });
      setComments((prev) => [...prev, ...res.data.comments]);
      if (comments.length + res.data.comments.length >= res.data.totalComments) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      await axios.delete(`${ENV.BACKEND_URL}/api/comment/deleteComment/${commentIdToDelete}`, {
        withCredentials: true
      });
      setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
      setTotalComments((prev) => prev - 1); 
      if (comments.length - 1 < totalComments) {
        setShowMore(true); 
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll p-3'>
      {currentUser?.rest?.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className='divide-y' key={comment._id}>
                <Table.Row className='bg-white'>
                  <Table.Cell>{new Date(comment.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className='w-full text-teal-500 text-sm py-7'>
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No comments found.</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500'>Are you sure you want to delete this comment?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComment}>Yes, I'm sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashComment;
