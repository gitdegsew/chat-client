import React from 'react'
import NavBar from './NavBar'
import Conversations from './Conversations'
import TextField from './TextField'
import {socket } from "../socket"

const CurrentChat = ({chats,chatSelected,setChats,setMessageToSend}) => {
  
 
  return (
    <div className='h-full flex flex-col justify-between w-2/3 px-3'>
       <div>
       <NavBar chatSelected={chatSelected} />
        <hr className=''/>
       </div>
        
        

        <Conversations chats={chats} chatSelected={chatSelected} />
       <div>
       <hr />
       
       {chatSelected && <TextField chatSelected={chatSelected} chats={chats} setChats={setChats} setMessageToSend={setMessageToSend} />}
       </div>
    </div>
  )
}

export default CurrentChat