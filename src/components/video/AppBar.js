import React from 'react'
import {BiArrowBack} from 'react-icons/bi'
const AppBar = () => {
  return (
    <div className='flex justify-between w-full items-center h-[50px] bg-[#203000] text-white p-3'>
        <BiArrowBack/>
        <p>Video call</p>
    </div>
  )
}

export default AppBar