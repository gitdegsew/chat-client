import React, { useEffect } from 'react'
import src from '../assets/profile.jpg'
import {AiFillFile} from "react-icons/ai"

const SingleConversation = ({chat,chatSelected,setChats}) => {
  
 
  const date=new Date(chat.createdAt)
  const hour=date.getHours()%12
  const htd=hour<10?'0'+hour:hour
  const mtd=date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()
  const identify= date.getHours()<=12?"AM":"PM"
  const now= new Date()
  const diff= (date.getTime()-now.getTime())<1000 ?'just now':"not now"
  const user=JSON.parse(sessionStorage.getItem('currentUser'))
  let toCheck = chat.users?chat.users[0]:chat.from
  const isUser= toCheck===user.id
  // const name=user.username
  
  let  name=(chat.isPrivate && !isUser)?chatSelected.username: isUser?user.username:chat.sender?chat.sender:'text'
  
  if(!name){
    name='erorr'
  }
   
  return (
    
        

<div className={`flex my-2 gap-3 ${isUser?'flex-row-reverse':'flex-row'}`}>
{
  <span className="flex flex-col justify-center w-12 h-12 rounded-full bg-slate-800 text-white  items-center">
  <p>{name[0].toUpperCase()}</p>
</span>
}
<div className={`'flex flex-col max-w-[350px] ${isUser?'bg-[#fbfaf9] rounded-md text-[#30302f]':'bg-[#6a78d1] rounded-md text-white'} p-2 justify-between gap-y-4'`}>
     {chat.messageType==='image'?<img className='w-[18vw] ' src={chat.message} />: chat.messageType==="non-text"?<p>
      <AiFillFile/> {chat.message}
     </p>:chat.messageType==="image-blob"?<img className='w-[18vw]  ' src={chat.message} />:  <p>{chat.message}</p>}
    <p className='text-xs'>{`${htd}:${mtd} ${identify}` }</p>
    {/* `${htd}:${mtd} ${identify}` */}
</div>
</div>



    
  )
}

export default SingleConversation