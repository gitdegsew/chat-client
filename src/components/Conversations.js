import React from 'react'
import SingleConversation from './SingleConversation'
import {socket } from "../socket"


const Conversations = ({chats,chatSelected}) => {
  
  return (
    
        <div className='flex flex-col  p-6 gap-y-4 overflow-clip hover:overflow-y-auto scrollbar-track-slate-300  scrollbar-thin scrollbar-thumb-[#61605e]'>
             {!chatSelected?<p className='text-center'>select user or group and start chatting</p>:
              chats.length === 0?<p className='text-center'>start conversation with {chatSelected.username?chatSelected.username:chatSelected.groupName}</p>:
                chats.map((chat,index) =><SingleConversation key={index} chat={chat} chatSelected={chatSelected
                } />)
             }
        </div>
       
    
  )
}

export default Conversations