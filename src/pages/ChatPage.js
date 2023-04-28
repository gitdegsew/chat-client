import React,{useState,useEffect, useCallback, useRef, useContext, createContext} from 'react'
import SideBar from '../components/SideBar'
import Chats from '../components/Chats'
import CurrentChat from '../components/CurrentChat'
import {socket } from "../socket"
import { getUsers,getGroups } from '../utils/api';
import { appContext, userContext } from '../App'
import MyNotificaiton from '../components/video/notification'
import { useNavigate } from 'react-router'


const pageContext= createContext()
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
  const [receivedMessage,setReceivedMessage] = useState(null)
  const [fileshare,setFileshare] = useState({})

  const myChats=useRef([...chats])

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



  const download= (data, file)=>{
        
    let a=document.createElement('a')
    a.href=file
    a.download=data.metadata.filename
     a.click()
}

const handleMsgReceived=(data) =>{
    
  console.log('event received from page')
  
    
  const check=data.isPrivate?data.from:data.to
  
  if(chatSelected && check===chatSelected._id){
    setChats([...chats,data])
  }
 
}
const handleMsgReceivedOne=(data) =>{
    console.log('from handle msg received')
    
  console.log(' another event received from page')
  
    setReceivedMessage(data)
  
 
}



useEffect(()=>{

      return ()=>{
        socket.off('send-msg',handleMsgReceived)
      }
      
    
    
  })


  const sharefiles= ({buffer,from,to})=>{ 
    
    console.log('shared files',buffer)
    const sender=sessionStorage.getItem('username')
    fileshare.buffer.push(buffer)
    console.log(fileshare.transferred *100/fileshare.metadata.max_buffer_size)
    fileshare.transferred +=buffer.byteLength
    // setFileupload(Math.round(100*fileshare.transferred/fileshare.metadata.max_buffer_size)  + "%")
    if (fileshare.transferred===fileshare.metadata.max_buffer_size){
        console.log('download complete')
        // setFileupload()
       
        const blob=new Blob(fileshare.buffer, { type: fileshare.metadata.filetype})
        let file= URL.createObjectURL(blob)

        if(fileshare.metadata.filetype.includes("image")){
            const from= fileshare.metadata.from
            const message= file
            const sender=fileshare.metadata.sender
            const to= fileshare.metadata.to
            const isPrivate=fileshare.metadata.isPrivate
            const dataTosave={
              from,to,message,messageType:'image',isPrivate,sender
            }

            setReceivedMessage(dataTosave)
            
            // myChats.current=[...myChats.current,dataTosave]
            // console.log('from sharefile')
            console.log("before",chats)
            setChats([...chats,dataTosave])
            
            console.log("after",chats)
            // setAllMessages((list)=>[...list,{fr, message, reciever, messagetype:"image"}])
            
        }
        else {

          const sender=fileshare.metadata.sender
          const isPrivate=fileshare.metadata.isPrivate
          const dataTosave={
            from,to,message:fileshare.metadata.filename,messageType:'non-text',isPrivate,sender
          }

          setChats([...chats,dataTosave])
            
            // setReceivedMessage({
            //   from,to,message,messagetype:'non-text',isPrivate
            // })
            
            // setAllMessages((list)=>[...list,fileshare.metadata])
            console.log(fileshare.metadata.filetype.includes("images"))
            download(fileshare,file)
        }
           
        
    }

    else {
       
        socket.emit("fs-start",{
          from:to,
          to:from,
          isPrivate:true
        })
    }   

}

if(chatSelected){
  // socket.removeListener('send-msg')

  // socket.on('file-raw',sharefiles)
  socket.on('send-msg',handleMsgReceived)
  
}


  useEffect(()=>{
  
  socket.on("file-meta",(metadata)=>{
    console.log('file meta received', metadata)
      fileshare.metadata=metadata

      fileshare.transferred=0
      fileshare.buffer=[]
      socket.emit("fs-start",{from:user.id,to:metadata.from,isPrivate:true})
  })

  socket.on('file-raw',sharefiles)
  socket.on('send-msg',handleMsgReceivedOne)
 
    
    return ()=>{
      console.log('ratnesss cleared')
      socket.removeAllListeners('file-meta')
      socket.removeAllListeners('file-raw')
      socket.off('send-msg',handleMsgReceivedOne)
    }
  

  
  },[chats])

// useEffect(()=>{
  
//     socket.removeAllListeners('file-meta')
//     socket.off('file-raw')
//     socket.removeAllListeners('send-msg')
  

// },[chats])
   // shared files 

  

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
    
      
      setCaller(from)
      setIsBeingCalled(true)

      
    setTimeout(()=>{
      
      socket.emit('reject-request', {from:to,to:from})
      setIsBeingCalled(false)
      setCaller(null)
    },11000)

   
      
      
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
  

  

  return (
    <pageContext.Provider value ={
        {
          receivedMessage
        }
    }>
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
    </pageContext.Provider>
    
  )
}

export default ChatPage
export {pageContext}