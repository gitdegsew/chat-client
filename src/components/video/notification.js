import React from 'react'
import ReactLoading from "react-loading";
const MyNotificaiton = ({caller,onAcceptRequest,onRejectRequest}) => {
  return (
    <div className="flex flex-col justify-around items-center rounded-2xl w-auto    p-5 h-32 bg-[#044525] absolute top-2 right-4 z-40">
        <p className='font-RobotoM text-[#bada55] text-2xl pt-5' >{caller?caller.username:'somebody'}  asking video call...</p>
        <ReactLoading
            className=' -mt-5 mb-5'
            type="bubbles"
            color="#fff"
            height={60}
            width={100}
          />
        <div className='flex justify-around items-center gap-8 font-slab text-lg  font-bold pb-5 '>
            <span className='text-[#40f44c] cursor-pointer hover:text-[#5dd75d]' onClick={onAcceptRequest}>Accept</span>
            <span className='text-[#e11329]  cursor-pointer hover:text-[#8d686c]' onClick={onRejectRequest}>Decline</span>
        </div>
        
    </div>
  )
}

export default MyNotificaiton