import {getMessages} from '../utils/api'
import src from '../assets/profile.jpg'
import React, { createContext, useEffect, useState,useRef, useContext } from 'react'
import {socket } from "../socket"
import { pageContext } from '../pages/ChatPage'
import {BiImageAlt} from 'react-icons/bi'
import { appContext } from '../App'

export const chatContext =createContext()
const Chat = ({item,setChatSelected,chatSelected,setChats,messageToSend,tabSelected,lastMessages,setmCount }) => {
  const user= sessionStorage.getItem('currentUser')
  const value= true
  const name=item.username?item.username:item.groupName
  const currentUser=JSON.parse(sessionStorage.getItem('currentUser'))
  const [isLoading,setIsLoading] = useState(true)
  const [messages,setMessages] =useState([])
  const [error,setError] = useState(null)

  const {onlineUsers}=useContext(appContext)
  // console.log('from chat')
  // console.log(onlineUsers)
 
  
  const isOnline=onlineUsers.includes(item._id)
  // console.log(isOnline)
  const {
    receivedMessage,
    updatedItem,
    setUpdatedItem
  }=useContext(pageContext)

  
  const chat=messages.length>0 && messages[messages.length-1]
  const date=new Date(chat.createdAt)
  const hour=date.getHours()%12
  const htd=hour<10?'0'+hour:hour
  const mtd=date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()
  const identify= date.getHours()<=12?"AM":"PM"

 
   
  useEffect(()=>{
    
    if(receivedMessage){
      const toCheck=receivedMessage.isPrivate?receivedMessage.from:receivedMessage.to
      if(toCheck===item._id){
        setMessages([...messages,receivedMessage])
        // lastMessages.current.set(item,receivedMessage)
        
      }
     
      
    }
  },[receivedMessage])
  
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
      // lastMessages.current.set(item,data)
     
    }
  }

 




  useEffect(() => {
   

    if(messages && messageToSend && messageToSend.to===item._id ){
      setMessages([...messages,messageToSend])
      // lastMessages.current.set(item,messageToSend)
      setUpdatedItem({item,messageToSend})
      
    }
  },[messageToSend])
 
  useEffect(() =>{

    console.log('one form each chat')

    getMessages(currentUser.accessToken,currentUser.id,item._id,priv).then((result)=>{
      setMessages(result)
      setmCount(prev=>prev+1)
      lastMessages.current.set(item._id,result[result.length-1])
      socket.on('msg-receive',listner)
      setIsLoading(false)

    }).catch((error)=>{
      setError(error.messagees)
      setIsLoading(false)

    })

    

  },[])


// yared

  





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
          <span className="flex flex-col justify-center w-12 h-12 rounded-full bg-slate-800 text-white  items-center relative" >
              {item.username && isOnline && <div className='absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400'></div>}
              <p>{name[0].toUpperCase()}</p>
          </span>
          <div className="flex flex-col items-start className='text-[#656d5c]' ">
            <h3 className=' font-semibold'>{name}</h3>
            {
              isLoading && !error?<p className='text-xs'>message loading...</p>:
              !isLoading && error ?<p>error</p>:
              !isLoading && !error && messages && messages.length===0?<p className='text-[#bacda0]'>no chats yet</p>:
              <p className='text-[#465433]'>{(messages[messages.length-1].messageType==="image" ||messages[messages.length-1].messageType==="image-blob")?<span className='flex gap-2 justify-center items-center'><BiImageAlt/> image</span>:messages[messages.length-1].message.length>20?`${messages[messages.length-1].message.slice(0,20)}...`:messages[messages.length-1].message}</p>
            }
            
          </div>
          </div >
            <div>
            <p className="text-xs">{messages.length>0 && `${htd}:${mtd} ${identify}` }</p>
            {/* {
              count.current>0?<p className="h-5 w-5 rounded-full bg-blue-600 flex justify-center items-center" >
              {count.current}
            </p>:null
            } */}
            </div>
        </div>
  )
}

export default Chat