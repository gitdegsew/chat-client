import React, { useEffect } from 'react'
import src from '../assets/profile.jpg'

const SingleConversation = ({chat,chatSelected,setChats}) => {


  const user=JSON.parse(sessionStorage.getItem('currentUser'))
    const isUser=chat.users[0]==user.id
  
  
  const  name=chat.isPrivate && !isUser?chatSelected.username:isUser?user.username:chat.sender.username


  return (
    
        

<div className={`flex gap-3 ${isUser?'flex-row-reverse':'flex-row'}`}>
{
  <span className="flex flex-col justify-center w-12 h-12 rounded-full bg-slate-800 text-white  items-center">
  <p>{name[0].toUpperCase()}</p>
</span>
}
<div className={`'flex flex-col w-auto ${isUser?'bg-[#fbfaf9] rounded-md text-[#30302f]':'bg-[#6a78d1] rounded-md text-white'} p-2 justify-between gap-y-4'`}>
    <p>{chat.message}</p>
    <p className='text-xs'>12:20</p>

</div>
</div>



    
  )
}

export default SingleConversation