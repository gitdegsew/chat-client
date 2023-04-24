import React, { useContext ,useState} from 'react'
import { SocketContext } from './context'
import { socket } from '../../socket'


const VideoPlayer = ({callAccepted}) => {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));

 const {myVideo,userVideo,remoteStream} = useContext(SocketContext)
 const [stream,setStream] =useState(remoteStream)
  return (
    <div className='flex justify-between items-center w-full  gap-x-14'>
      <div className='flex flex-col w-1/2 items-center   '>
        <p>{user.username}</p>
        <video playsInline  autoPlay ref={myVideo} className="p-3 w-11/12 h-72 bg-black" />
      </div>
     
         <div className='flex flex-col items-center w-1/2 '>
          
        <p>user one</p>
        <video playsInline  autoPlay ref={userVideo}   className="w-11/12 h-72  p-3 bg-black" hidden={!callAccepted} />
      </div>
      
      
    </div>
  )
}

export default VideoPlayer