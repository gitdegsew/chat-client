import React, { useState } from 'react'
import {BsEmojiSmile} from "react-icons/bs"
import {MdSend} from "react-icons/md"
import {socket } from "../socket"
import {ImAttachment} from 'react-icons/im'

const TextField = ({chatSelected,setChats,chats,setMessageToSend}) => {
    const user=JSON.parse(sessionStorage.getItem('currentUser'))
    const [text,setText] =useState('')


    const sendFile=(e)=>{
      console.log('send file')

    }

    const handleSend=async()=>{
      console.log('handle send is called')

      const messageToSend ={
        message:text,
        from:user.id,
        sender:user,
        to:chatSelected._id,
        users:[user.id,chatSelected],
        isPrivate:chatSelected.username?true:false
      }

     

     
      
        socket.emit('send-msg',messageToSend,(err)=>{
          if(!err){
            setText('')
            setChats([...chats,messageToSend])
            setMessageToSend(messageToSend)
          }
        })

        
    }
  return (
    <div className='flex z-10 w-11/12 py-3 justify-between gap-x-6'>
        <input  type="file" className="hidden"  id="file" onChange={sendFile} />
          
                <label htmlFor="file" ><ImAttachment className="h-8 w-8" /></label>
        <div className="flex bg-[#d9dfe1] rounded-md  h-10 w-full  p-4 items-center gap-x-4 " >
            
            <input className=' bg-[#d9dfe1] px-1 w-full focus:outline-none' type="text" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Type text here..." />
            <BsEmojiSmile/>
        </div>
        <button className='flex justify-center items-center rounded-sm bg-[#416269] w-20' disabled={!text} onClick={handleSend} >
            <MdSend className='text-white w-8 h-8 hover:cursor-pointer ' />

        </button>
    </div>
  )
}

export default TextField