import React, { useEffect } from 'react'
import VideoPlayer from '../components/video/VideoPlayer'
import { socket } from '../socket'


const VideoPage = () => {
  const user=JSON.parse(sessionStorage.getItem('currentUser'))
  useEffect(() =>{
    socket.connect()
    // socket.emit('login',user.id)
  },[])
  return (
    <div className='flex flex-col justify-around items-center w-full'>
        <h1>{user.username}</h1>
        <VideoPlayer/>
    </div>
  )
}

export default VideoPage