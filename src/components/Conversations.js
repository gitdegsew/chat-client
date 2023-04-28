import React, { useContext, useEffect, useRef } from 'react'
import SingleConversation from './SingleConversation'
import ReactScrollableFeed from 'react-scrollable-feed'
import { pageContext } from '../pages/ChatPage'



const Conversations = ({chats,chatSelected}) => {
  const user=JSON.parse(sessionStorage.getItem('currentUser'))
 
  // console.log('chats')
  // console.log(chats)
  
  
  
  
  return (
    
        <div className='flex flex-col  p-6 gap-y-6 overflow-clip hover:overflow-y-auto scrollbar-track-slate-300  scrollbar-thin scrollbar-thumb-[#61605e]'>
             {!chatSelected?<p className='text-center'>select user or group and start chatting</p>:
              chats.length === 0?<p className='text-center'>start conversation with {chatSelected.username?chatSelected.username:chatSelected.groupName}</p>:
               <ReactScrollableFeed forceScroll={chats[chats.length-1].from==user.id}>
                  { chats.map((chat,index) =><SingleConversation key={index} chat={chat} chatSelected={chatSelected
                } />)}
               </ReactScrollableFeed>
               
               
             }
        </div>
       
    
  )
}

export default Conversations