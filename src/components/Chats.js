import React, { useEffect, useState } from 'react'
import {BsBellFill} from "react-icons/bs"
import {FiSearch} from "react-icons/fi"
import Chat from './Chat'

const Chats = ({users,groups,tabSelected ,setChatSelected,chatSelected,setChats,messageToSend,counts}) => {
  
 
  const allChats=[...users,...groups]
  
  
  
  const [searchItem,setSearchItem] = useState('')
 
  return (
    <div className="flex flex-col bg-[#e8eeef] w-1/3 p-4 h-full gap-y-6" >
       <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">{tabSelected}</h2>

        <BsBellFill/>
        </div> 
        <div className="flex bg-[#f5fcff] h-10 rounded-2xl p-4 items-center gap-x-4 " >
            <FiSearch/>
            <input className='w-full bg-[#f5fcff] px-1 focus:outline-none' type="text" value={searchItem} onChange={(e)=>setSearchItem(e.target.value)} placeholder="Search user" />
        </div>

        <h2 className='font-medium'>Recent</h2>
        <div className='flex flex-col gap-y-4 overflow-clip hover:overflow-y-auto  scrollbar-track-slate-300  scrollbar-thin scrollbar-thumb-[#61605e]'>
         
          { 
            allChats.map((item,index)=><Chat counts={counts} chatSelected={chatSelected} key={index} messageToSend={messageToSend} item={item} setChatSelected={setChatSelected} setChats={setChats} tabSelected={tabSelected} />)
          }

        </div>
        
        
    </div>
  )
}

export default Chats