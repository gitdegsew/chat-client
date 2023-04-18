import React,{useState,useEffect} from 'react'
import SideBar from '../components/SideBar'
import Chats from '../components/Chats'
import CurrentChat from '../components/CurrentChat'
import {socket } from "../socket"
import { getUsers,getGroups } from '../utils/api';
import { userContext } from '../App'

const ChatPage = () => {
  const user=JSON.parse(sessionStorage.getItem('currentUser'))
  const [users,setUsers] = useState(null)
  const [groups,setGroups] = useState(null)
  const [tabSelected,setTabSelected] = useState('allChats')
  const [isLoading,setLoading] =useState(true)
  const [chatSelected,setChatSelected] = useState(null)
  const [messageToSend,setMessageToSend] = useState(null)
  const [chats,setChats] =useState([])
  
  
  const [error,setError]=useState(null)

  if(chatSelected){
    
    socket.on('msg-receive',(data) =>{
      const check=data.isPrivate?data.from:data.to
      if(check===chatSelected._id){
        setChats([...chats,data])
      }
     
    })
  }



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
        socket.emit('login',user.id)
    
  

  },[])

  

  return (
    <div className='flex gap-x-2 justify-start  left-0 top-0 w-full fixed ' >

      {
        isLoading && !error?<p>loading...</p>:
        !isLoading && error?<p>{error}</p>:
        (
          <><SideBar tabSelected={tabSelected} setTabSelected={setTabSelected} /><Chats messageToSend= {messageToSend} users={users} groups={groups} tabSelected={tabSelected} setChatSelected={setChatSelected} setChats={setChats} /><CurrentChat setMessageToSend={setMessageToSend} chatSelected={chatSelected} chats={chats} setChats={setChats} /></>
        )

      }
       
        
    </div>
  )
}

export default ChatPage