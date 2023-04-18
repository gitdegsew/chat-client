import {getMessages} from '../utils/api'
import src from '../assets/profile.jpg'
import React, { createContext, useEffect, useState } from 'react'
import {socket } from "../socket"

export const chatContext =createContext()
const Chat = ({item,setChatSelected,setChats,messageToSend}) => {
  const value= true
  const name=item.username?item.username:item.groupName
  const currentUser=JSON.parse(sessionStorage.getItem('currentUser'))
  const [isLoading,setIsLoading] = useState(true)
  const [messages,setMessages] =useState(null)
  const [error,setError] = useState(null)

  let priv=item.username?1:0

  useEffect(() => {
    if(messages &&messageToSend.to===item._id ){
      setMessages([...messages,messageToSend])
    }
  },[messageToSend])
 
  useEffect(() =>{
    getMessages(currentUser.accessToken,currentUser.id,item._id,priv).then((messages)=>{
      setMessages(messages)
      socket.on('msg-receive',(data) =>{
        console.log('event received from chat',data.to,item._id)
        const check=data.isPrivate?data.from:data.to
        if(check===item._id){
          setMessages([...messages,data])
        }
       
      })
      setIsLoading(false)

    }).catch((error)=>{
      setError(error.messagees)
      setIsLoading(false)

    })

  },[value])
  
  return (
    <div className="flex justify-between items-end rounded-lg  hover:cursor-pointer hover:bg-[#d7d4d9]" onClick={()=>{
      setChatSelected(item)
      setChats(messages)
    }
    } >
          <div className="flex items-center gap-x-4">
          <span className="flex flex-col justify-center w-12 h-12 rounded-full bg-slate-800 text-white  items-center">
              <p>{name[0].toUpperCase()}</p>
          </span>
          <div className="flex flex-col ">
            <h3 className='font-medium'>{name}</h3>
            {
              isLoading && !error?<p className='text-xs'>message loading...</p>:
              !isLoading && !messages?<p>error</p>:
              !isLoading && !error && messages && messages.length===0?<p>no chats yet</p>:
              <p>{messages[messages.length-1].message}</p>
            }
            
          </div>
          </div>
        <p className="text-xs">2:42</p>
        </div>
  )
}

export default Chat