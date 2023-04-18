import React from 'react'
import src from '../assets/profile.jpg'
// import {BsPersonCircle} from 'react-icons/fa'
import { RiAccountCircleFill ,RiFileUserLine} from "react-icons/ri";
import {FaUserFriends} from "react-icons/fa"
import {HiUserGroup} from "react-icons/hi"
import {AiOutlineSetting} from "react-icons/ai"
import {CgProfile} from "react-icons/cg"
import {BsGlobe2,BsChatSquareTextFill} from "react-icons/bs"
const SideBar = ({setTabSelected,tabSelected}) => {
  const user = JSON.parse(sessionStorage.getItem('currentUser'))
  return (
    <div className="flex flex-col justify-around w-20 items-center h-full ">
        <div>
        <span className="flex flex-col justify-center w-12 h-12 rounded-full bg-[#007474] text-white  items-center">
              <p>{user.username[0].toUpperCase()}</p>
          </span>
          <span>{user.username}</span>
        </div>
        <div className='flex flex-col justify-between gap-y-8'>
        <BsChatSquareTextFill  className={`w-8 h-8  ${tabSelected=="allChats"?"text-[#00ccff]":'text-[black]'} hover:cursor-pointer ${tabSelected!=="allChats"?"hover:text-[#c3bfc6]":null}`} onClick={e=>{
          setTabSelected("allChats")
          
        }} />
        <CgProfile className={`w-8 h-8  ${tabSelected=="users"?"text-[#00ccff]":'text-[black]'} hover:cursor-pointer ${tabSelected!=="users"?"hover:text-[#c3bfc6]":null}`} onClick={e=>{
          setTabSelected("users")
          
        }}  />
        <HiUserGroup className={`w-8 h-8  ${tabSelected=="groups"?"text-[#00ccff]":'text-[black]'} hover:cursor-pointer ${tabSelected!=="groups"?"hover:text-[#c3bfc6]":null}`} onClick={e=>{
          setTabSelected("groups")
          
        }} />
        
        
        <AiOutlineSetting className='w-8 h-8' />
        </div>
        <div className='flex flex-col justify-between gap-y-8' >
        <BsGlobe2 className='w-8 h-8' />
        <RiAccountCircleFill className='w-8 h-8' />
        </div>

    </div>
  )
}

export default SideBar