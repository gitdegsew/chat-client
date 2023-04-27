import React, { useContext ,useEffect,useRef,useState,} from 'react'
import { SocketContext } from './context'
import { IoMdVideocam } from "react-icons/io";
import { MdVideocamOff } from "react-icons/md";
import { BiPhoneOff } from "react-icons/bi";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";


const Controls = ({isMicEnabled,isVidEnabled,toggleCamera,toggelMic,isAnswered,setIsAnswered,endCall}) => {

   const  {callAccepted}=useContext(SocketContext)
    
    
    

  return (
    <div className="flex justify-center items-center fixed bottom-5 z-20  ">
        <div className="flex justify-center items-center gap-8">
          <div
            className={`flex justify-center items-center w-12 h-12 cursor-pointer rounded-full ${
              isVidEnabled ? "bg-[#4484f1]" : "bg-[#cd3740]"
            }`}
            onClick={toggleCamera}
          >
            {isVidEnabled ? (
              <IoMdVideocam id="vid" className="text-white w-8 h-8 " />
            ) : (
              <MdVideocamOff className="text-white w-8 h-8 " />
            )}
          </div>
          <div
            className={`flex justify-center items-center w-12 h-12 cursor-pointer rounded-full ${
              isMicEnabled ? "bg-[#4484f1]" : "bg-[#cd3740]"
            }`}
            onClick={toggelMic}
          >
            {isMicEnabled ? (
              <BsFillMicFill className="text-white w-8 h-8 " />
            ) : (
              <BsFillMicMuteFill className="text-white w-8 h-8 " />
            )}
          </div>
          <button
            className={`flex justify-center items-center w-12 h-12  rounded-full ${
              isAnswered ? "bg-[#cd3740] cursor-pointer" : "bg-[#848484]"
            } `}
            disabled={!isAnswered}
            onClick={endCall}
          >
            <BiPhoneOff className="text-white w-8 h-8 "  />:
          </button>
        </div>
      </div>
  )
}

export default Controls