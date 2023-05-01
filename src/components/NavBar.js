import React, { useContext } from 'react'
import src from '../assets/profile.jpg'
import {FiSearch} from "react-icons/fi"
import {MdCall,MdVideoCall} from "react-icons/md"
import {HiOutlineDotsHorizontal} from 'react-icons/hi'
import { useNavigate } from 'react-router'
import { appContext } from '../App'

const NavBar = ({chatSelected}) => {
  const navigate=useNavigate()

  const {onlineUsers}=useContext(appContext)
  // console.log('from chat')
  // console.log(onlineUsers)
  
  let isOnline
  let name
  if(chatSelected){
    isOnline=onlineUsers.includes(chatSelected._id)
    name=chatSelected.username?chatSelected.username:chatSelected.groupName
  }

  const handleClick =()=>navigate('/videoCall',{
    state:{
      remoteUser:chatSelected
    }
  })

  return (
    <div className='flex justify-between items-center z-10 '>
        
            <div className="flex justify-center items-center p-3 gap-x-2">
            {
              chatSelected?<>
              <span className="flex flex-col justify-center w-12 h-12 rounded-full bg-slate-800 text-white  items-center">
              <p>{name[0].toUpperCase()}</p>
          </span>
            <h3 className='font-medium'>{chatSelected.username?chatSelected.username:chatSelected.groupName}</h3>
              </>:
              <p>No chat selected</p>
            }

            </div>

            <div className='flex justify-center gap-x-4 pr-6'>
            <FiSearch/>
            <MdCall/>
            <MdVideoCall className={`${(chatSelected && chatSelected.username && isOnline)?"cursor-pointer":"text-gray-400"}`} onClick={(chatSelected && chatSelected.username && isOnline)?handleClick:()=>{}} />
            <HiOutlineDotsHorizontal/>


            </div>
           
        
        
    </div>
    
  )
}

export default NavBar