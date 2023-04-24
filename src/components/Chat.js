import {getMessages} from '../utils/api'
import src from '../assets/profile.jpg'
import React, { createContext, useEffect, useState,useRef } from 'react'
import {socket } from "../socket"

export const chatContext =createContext()
const Chat = ({item,setChatSelected,chatSelected,setChats,messageToSend,tabSelected}) => {
  const value= true
  const name=item.username?item.username:item.groupName
  const currentUser=JSON.parse(sessionStorage.getItem('currentUser'))
  const [isLoading,setIsLoading] = useState(true)
  const [messages,setMessages] =useState([])
  const [error,setError] = useState(null)
  
  let priv=item.username?1:0

  const count=useRef(item.unseen)

  const listner=(data) =>{
    console.log('event received from chat')
    // console.log('chat selected',chatSelected)
    const check=data.isPrivate?data.from:data.to
    if(item && check===item._id){
      if(chatSelected && chatSelected._id!==item._id){
        count.current=count.current+1
      }
      
    console.log(count.current)
      setMessages([...messages,data])
      // setNotification([...notification,data])
     
    }
  }

  useEffect(() => {
   

    if(messages && messageToSend && messageToSend.to===item._id ){
      setMessages([...messages,messageToSend])
    }
  },[messageToSend])
 
  useEffect(() =>{

    

    getMessages(currentUser.accessToken,currentUser.id,item._id,priv).then((result)=>{
      setMessages(result)
      socket.on('msg-receive',listner)
      setIsLoading(false)

    }).catch((error)=>{
      setError(error.messagees)
      setIsLoading(false)

    })

    

  },[chatSelected])
  useEffect(()=>{
    return  ()=>{
      socket.off('msg-receive',listner)
    }
  },[chatSelected])

  return (
    <div className={`${(tabSelected=="Users" && !item.username)|| (tabSelected=="Groups" &&!item.groupName)?"hidden":"flex"} justify-between items-end rounded-lg   hover:cursor-pointer hover:bg-[#d7d4d9]` } onClick={()=>{
      setChatSelected(item)
      count.current=0
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
              !isLoading && error ?<p>error</p>:
              !isLoading && !error && messages && messages.length===0?<p>no chats yet</p>:
              <p>{messages[messages.length-1].message}</p>
            }
            
          </div>
          </div >
            <div>
            <p className="text-xs">2:42</p>
            {
              count.current>0?<p className="h-5 w-5 rounded-full bg-blue-600 flex justify-center items-center" >
              {count.current}
            </p>:null
            }
            </div>
        </div>
  )
}

export default Chat