import React, { useEffect, useState } from 'react'
import moment from 'moment'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { FaThumbsUp } from "react-icons/fa6";
import { Button, Textarea } from 'flowbite-react'
import { ENV } from '../config/env';

const Comment = ({ comment, onlike, onEdit, onDelete }) => {
  const { currentUser } = useSelector((state) => state.user)
  const [user, setUser] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(comment.content)
  const [likes, setLikes] = useState(comment.likes)
  const [hasLiked, setHasLiked] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${ENV.BACKEND_URL}/api/user/${comment.userId}`, {
          withCredentials: true
        })
        setUser(res?.data)
      } catch (error) {
        console.log(error.message)
      }
    }
    getUser()

    if (currentUser && likes.includes(currentUser._id || currentUser.rest._id)) {
      setHasLiked(true)
    }
  }, [comment, currentUser, likes])

  const handleLike = async () => {
    try {
      const userId = currentUser?.rest?._id || currentUser?._id
      await onlike(comment?._id)

      if (hasLiked) {
        setLikes(likes.filter(id => id !== userId))
        setHasLiked(false)
      } else {
        setLikes([...likes, userId])
        setHasLiked(true)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${ENV.BACKEND_URL}/api/comment/editComment/${comment._id}`,
        { content: editedContent },
        { withCredentials: true }
      )
      setIsEditing(false)
      onEdit(comment._id, editedContent)
    } catch (error) {
      console.log(error.message)
    }
  }



  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img className='w-10 h-10 rounded-full bg-gray-200' src={user?.profilePicture} alt={user?.username} />
      </div>
      <div className="flex-1">
        <div className="font-bold mr-1 text-xs truncate flex gap-1">
          <span>{user ? `@${user?.username}` : 'anonymous user'}</span>
          <span className="text-gray-600 text-xs ">{moment(comment.createdAt).fromNow()}</span>
        </div>
        {
          isEditing ? (
            <>
              <Textarea
                className='mb-2'
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="flex justify-end gap-3 text-xs">
                <Button
                  type='button'
                  size='sm'
                  gradientDuoTone='purpleToBlue'
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  type='button'
                  size='sm'
                  gradientDuoTone='purpleToBlue'
                  outline
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
          )
            :
            (<>
              <p className='text-gray-500 mb-2'>{comment?.content}</p>
              <div className="">
                <button
                  type='button'
                  onClick={handleLike}
                  className={`text-gray-500 hover:text-blue-500 text-sm ${hasLiked ? '!text-blue-500' : ''
                    }`}
                >
                  <FaThumbsUp />
                </button>
                <span className='ml-2'>{likes.length}</span>
                {
                  currentUser && (currentUser?.rest?._id === comment.userId || currentUser?.rest?.isAdmin || currentUser?.isAdmin) && (
                    <>
                    <button
                      type='button'
                      className='text-gray-500 hover:text-blue-500 text-sm ml-2'
                      onClick={() => setIsEditing(true)}
                    >Edit
                    </button>
                    <button
                      type='button'
                      className='text-gray-500 hover:text-red-500 text-sm ml-2'
                      onClick={() => onDelete(comment._id)}
                    >Delete
                    </button>

                    </>
                  )
                }
              </div>
            </>)
        }
      </div>
    </div>
  )
}

export default Comment
