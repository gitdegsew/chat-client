import React,{useState,useEffect, useCallback, useRef, useContext} from 'react'
import SideBar from '../components/SideBar'
import Chats from '../components/Chats'
import CurrentChat from '../components/CurrentChat'
import {socket } from "../socket"
import { getUsers,getGroups } from '../utils/api';
import { appContext, userContext } from '../App'
import MyNotificaiton from '../components/video/notification'
import { useNavigate } from 'react-router'



const ChatPage = () => {
  const user=JSON.parse(sessionStorage.getItem('currentUser'))
  const [users,setUsers] = useState(null)
  const [groups,setGroups] = useState(null)
  const [tabSelected,setTabSelected] = useState('All chats')
  const [isLoading,setLoading] =useState(true)
  const [chatSelected,setChatSelected] = useState(null)
  const [messageToSend,setMessageToSend] = useState(null)
  const [chats,setChats] =useState([])
  const [caller,setCaller] = useState(null)

  const  {
    isBeingCalled,
    requestRejected,
    requestAccepted,
    setIsBeingCalled,
    setRequestAccepted,
    setRequestRejected
  }=useContext(appContext)
  
  // const [calling,setCalling]=useState(false)
  
  // const [notification,setNotification] = useState([])
  const count=useRef([])

  const navigate=useNavigate()
  
  const [error,setError]=useState(null)

 const onAnswer=() =>{
  socket.emit('accept-request',{from:user.id,to:caller.id})
  navigate('/videoCall',
 { state:{
    remoteUser:caller
  }}
  )

 }
 const onReject=() =>{
  // socket.emit()
  socket.emit('reject-request',{from:user.id,to:caller.id})
  setCaller(null)
  setIsBeingCalled(false)

 }

  const handleReceiveCall=({from,to})=>{
    console.log('call received ')
    
    if(to._id===user.id){
      
      setCaller(from)
      setIsBeingCalled(true)
    }
      
      
  }

  


  const handleMsgReceived=(data) =>{
    count.current.push(data)
    console.log('event received from page')
    console.log(count.current)
    const check=data.isPrivate?data.from:data.to
    if(chatSelected && check===chatSelected._id){
      setChats([...chats,data])
    }
   
  
}
  

if(chatSelected){
    
  socket.once('msg-receive',handleMsgReceived)
}

// video call

useEffect(()=>{


  socket.on('receive-call',handleReceiveCall)
  


  return () => {
    console.log("cleared chat page")
    socket.removeAllListeners("receive-call");
   
    
  };
},[])

  useEffect(() =>{
    
   
   
    
    getUsers(user.accessToken,user.id).then(users =>{
      setUsers(users)
      
      
      getGroups(user.accessToken).then(groups =>{
        setGroups(groups)
       setLoading(false)
        
      })
    }
    ).catch(error =>{
      setLoading(false)
      setError(error.message)
    }
      )
    
      
        socket.connect()
        socket.emit('login',user)
    
  

  },[])
  useEffect(()=>{

    return  ()=>{
      socket.off('msg-receive',handleMsgReceived)
    }
    
  },[chats])

  

  return (
    <div className='flex gap-x-2 justify-start  left-0 top-0 w-full fixed ' >

      {
        isLoading && !error?<p>loading...</p>:
        !isLoading && error?<p>{error}</p>:
        (
          <>
          {isBeingCalled&& caller&& <MyNotificaiton caller={caller} onAnswer={onAnswer} onReject={onReject}   />}
          <SideBar tabSelected={tabSelected} setTabSelected={setTabSelected} /><Chats messageToSend= {messageToSend} users={users} groups={groups} tabSelected={tabSelected} setChatSelected={setChatSelected} setChats={setChats} chatSelected={chatSelected} /><CurrentChat setMessageToSend={setMessageToSend} chatSelected={chatSelected} chats={chats} setChats={setChats} /></>
        )

      }
       
        
    </div>
  )
}

export default ChatPage