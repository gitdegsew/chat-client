import React, { useContext } from 'react'
import { SocketContext } from "./context";
import { appContext } from '../../App';
import ReactLoading from "react-loading";

const MyVideos = ({isVidEnabled,userToCall,isLoading}) => {

    const {
        myVideo,
        userVideo,
        localStream,
        // callAccepted,
        remoteStream,
        callUser,
        isCalling,
        setIsCalling,
        remoteUser,
        answerCall,
        // setCallAccepted,
        isAnswered,
        setIsAnswered,
        rs,
        rls,
        peerConnection,
        isVideo,
      } = useContext(SocketContext)
    
      const {
        isBeingRequested,
        setIsBeingRequested,
        isBeingCalled,
        requestRejected,
        requestAccepted,
        setIsBeingCalled,
        setRequestAccepted,
        setRequestRejected,
      } = useContext(appContext);


    const user = JSON.parse(sessionStorage.getItem("currentUser"));
  return (
    <div
    className={`${
      !isAnswered &&
      "flex  justify-center items-center w-full  gap-x-14    "
    }`}
  >
    <div
      className={`flex flex-col items-center    ${
        isAnswered
          ? "fixed top-0 left-0 bottom-[80%] right-[80%]   p-3 z-40"
          : "w-1/2 h-72"
      }  `}
    >
      <video
        autoPlay
        ref={myVideo}
        className={`p-3 w-full h-72  bg-slate-800 ${isAnswered && "rounded-2xl z-40"}  `}
        hidden={!isVidEnabled}
        muted
      />

      {!isVidEnabled && (
        <div className={`p-3  flex flex-col justify-center w-full h-full    bg-slate-800 text-white  items-center ${isAnswered && "border-solid border-2 border-sky-500 mt-3 bg-zinc-50 rounded-lg w-48 h-64"} `}>
          <div className={`bg-red-500 rounded-full flex justify-center items-center ${isAnswered?"w-24 h-24":"w-44 h-44"}  `}>
            <p className={`${!isAnswered? "text-9xl":"text-5xl"}`}>{user.username[0].toUpperCase()}</p>
          </div>
        </div>
      )}
    </div>
    <div className="font-foana" hidden={!isLoading}>
      calling
      <ReactLoading
        type="bubbles"
        color="#5d27d1"
        height={100}
        width={105}
      />
    </div>

    <div
      className={`flex flex-col  items-center    ${
        isAnswered
          ? "fixed top-0 left-0 bottom-0 right-0 p-3 z-10 "
          : "w-1/2 h-72 "
      }  `}
    >
      <video
        autoPlay
        ref={userVideo}
        className={`w-full  ${isAnswered?"h-full":"h-72"}  p-8 bg-black`}
        hidden={!isAnswered}
      />

      {!isAnswered && <div className="p-8 flex flex-col justify-center w-full h-full mt-[-60]  bg-slate-800 text-white  items-center">
        <div className=" rounded-full bg-lime-600 flex justify-center items-center  w-44 h-44">
          <p className="text-9xl">{userToCall.username[0].toUpperCase()}</p>
        </div>
      </div>}
    </div>
  </div>
  )
}

export default MyVideos