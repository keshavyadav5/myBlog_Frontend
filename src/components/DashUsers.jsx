import React, { useEffect, useState } from 'react';
import { Table, Modal, Button } from 'flowbite-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from "react-icons/fa";
import { MdDelete } from 'react-icons/md';
import { ENV } from '../config/env';

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${ENV.BACKEND_URL}/api/user/getusers`,
        { withCredentials : true}
      );

      if (res.data.success === false) {
        toast.error('Error fetching users');
      }

      setUsers(res?.data?.users);
      if (res.data.users.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (currentUser?.rest?.isAdmin || currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser?._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await axios.get(
        `${ENV.BACKEND_URL}/api/user/getusers?limit=9&startIndex=${startIndex}`
      );
      setUsers([...users, ...res.data.users]);
      if (res.data.users.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const confirmDeleteUser = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`${ENV.BACKEND_URL}/api/user/delete/${userToDelete}`, {
        withCredentials: true,
      });
      toast.success('User deleted successfully');
      setUsers(users.filter(user => user._id !== userToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Error deleting user');
      setShowDeleteModal(false);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar'>
      {currentUser?.rest?.isAdmin || currentUser?.isAdmin && users?.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user, index) => (
              <Table.Body key={index}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user?.profilePicture || '/default-user.png'}
                      alt={user?.username}
                      className='w-10 h-10 object-cover rounded-full bg-gray-500'
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {user?.username}
                  </Table.Cell>
                  <Table.Cell>{user?.email}</Table.Cell>
                  <Table.Cell>{user?.isAdmin ?<div className='text-teal-600'><FaCheck/></div> : (<div className='text-red-500'><FaTimes/></div>)}</Table.Cell>
                  <Table.Cell onClick={() => confirmDeleteUser(user._id)}>
                    <span className='text-xl text-red-500 cursor-pointer'>
                      <MdDelete />
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className='w-full mt-4 text-emerald-500'>
              Show more
            </button>
          )}
        </>
      ) : (
        <p>There are no users yet</p>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <Modal.Header>
            Confirm Delete
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this user?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={deleteUser} color="failure">Confirm</Button>
            <Button onClick={() => setShowDeleteModal(false)} color="gray">Cancel</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default DashUsers;
