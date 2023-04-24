import React from 'react'
import src from '../assets/profile.jpg'
// import {BsPersonCircle} from 'react-icons/fa'
import { IoMdLogOut } from "react-icons/io";
import {FaUserFriends} from "react-icons/fa"
import {HiUserGroup} from "react-icons/hi"
import {AiOutlineSetting} from "react-icons/ai"
import {CgProfile} from "react-icons/cg"
import {BsGlobe2,BsChatSquareTextFill} from "react-icons/bs"
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

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
        <BsChatSquareTextFill  className={`w-8 h-8  ${tabSelected=="All chats"?"text-[#00ccff]":'text-[black]'} hover:cursor-pointer ${tabSelected!=="All chats"?"hover:text-[#c3bfc6]":null}`} onClick={e=>{
          setTabSelected("All chats")
          
        }} />
        <CgProfile className={`w-8 h-8  ${tabSelected=="Users"?"text-[#00ccff]":'text-[black]'} hover:cursor-pointer ${tabSelected!=="Users"?"hover:text-[#c3bfc6]":null}`} onClick={e=>{
          setTabSelected("Users")
          
        }}  />
        <HiUserGroup className={`w-8 h-8  ${tabSelected=="Groups"?"text-[#00ccff]":'text-[black]'} hover:cursor-pointer ${tabSelected!=="Groups"?"hover:text-[#c3bfc6]":null}`} onClick={e=>{
          setTabSelected("Groups")
          
        }} />
        
        
        <AiOutlineSetting className='w-8 h-8' />
        </div>
        <div className='flex flex-col justify-between gap-y-8' >
        <BsGlobe2 className='w-8 h-8' />
        <IoMdLogOut id="app-title" className='w-8 h-8 hover:cursor-pointer'   />
        </div>
        <ReactTooltip
        anchorId="app-title"
        place="bottom"
        variant="info"
        content="log out"
      />

    </div>
  )
}

export default SideBar