import React, { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "./context";
import { socket } from "../../socket";
import ReactLoading from "react-loading";

import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Controls from "./Controls";
import AppBar from "./AppBar";
import { useLocation, useNavigate } from "react-router";
import { appContext } from "../../App";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaLastfmSquare } from "react-icons/fa";
import MyNotificaiton from "./notification";


const VideoPlayer = () => {
  
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  const [isVidEnabled, setIsVidEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [caller,setCaller] = useState(null)
  const [timeoutId,setTimeoutId] = useState(null)



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
    setIsAnswered
  } = useContext(SocketContext);

  
  const  {
    isBeingRequested,
    setIsBeingRequested,
    isBeingCalled,
    requestRejected,
    requestAccepted,
    setIsBeingCalled,
    setRequestAccepted,
    setRequestRejected
  }=useContext(appContext)

  const navigate=useNavigate()

  const handleReceiveAccept=()=>{
    console.log("Receive Accept")
    setRequestAccepted(true)
    callUser()
  }
  const handleReceiveReject=()=>{
    console.log("Receive reject")
    setIsCalling(false)
    setRequestRejected(true)
    notify("Call rejected")

  }


  const onAcceptRequest=() =>{
    socket.emit('accept-request',{from:user.id,to:caller.id})
    setIsBeingCalled(true)
    setRequestAccepted(true)
    setIsBeingRequested(false)
    clearTimeout(timeoutId)
    navigate('/videoCall',
   { state:{
      remoteUser:caller
    }}
    )
  
   }
   const onRejectRequest=() =>{
    // socket.emit()
    socket.emit('reject-request',{from:user.id,to:caller.id})
    setCaller(null)
    clearTimeout(timeoutId)
    setIsBeingRequested(false)
  
   }





  
  const handleAnswerCall=()=>{
    answerCall({from:remoteUser.id,to:user.id})
    setIsBeingCalled(false)
    setIsAnswered(true)
  }
  const handleRejectCall=()=>{
    socket.emit('reject-call',{from:user.id,to:remoteUser.id})
    setIsBeingCalled(false)
    // setIsAnswered(false)
  }

  const handleEndCall=()=>{
    // setCallAccepted(false)
    setIsCalling(false)
    setIsAnswered(false)
    setIsBeingCalled(false)
    notify('call ended')
    // setIsAnswered(true)
  }

  const handleReceiveCall=({from,to})=>{
    console.log('call received from vp ')
    
      
      setCaller(from)
      setIsBeingRequested(true)
      // console.log(isBeingRequested)
      // console.log(caller)
      
    const ti= setTimeout(()=>{
      
      
       console.log("time out executed from vp")
        socket.emit('reject-request', {from:to._id,to:from.id})
        setIsBeingRequested(false)
      
    },11000)
    setTimeoutId(ti)

   console.log('timeout id from vp: ',ti)
      
      
  }


  const handleCancelCall=({from,to})=>{
    console.log('call cnacelled ')
    
      notify("call cnacelled")
      setCaller(null)
      clearTimeout(timeoutId)
      
      setIsBeingRequested(true)
      setIsBeingCalled(false)
 
      
  }
  const handleReceiveRejectCall=({from,to})=>{
    console.log('call rejecte received ')
    
      notify("call rejected")
      setIsCalling(false)
      
   
  }

  const notify = (text) => toast.error(text);

  useEffect(()=>{


    socket.on('receive-call',handleReceiveCall)
    socket.on('cancel-call',handleCancelCall)
    
    
  
  
    return () => {
      console.log("cleared video player timeoutid")
      socket.removeAllListeners("receive-call");
      socket.removeAllListeners('cancel-call');
     
      
    };
  },[timeoutId])


  useEffect(()=>{


    
    socket.on('reject-request',handleReceiveReject)
    socket.on('accept-request',handleReceiveAccept)
    socket.on('end-call',handleEndCall)
    socket.on('reject-call',handleReceiveRejectCall)
    
    
  
  
    return () => {
      
      console.log('video player cleared')
      socket.removeAllListeners("accept-request");
      socket.removeAllListeners("reject-request");
      socket.removeAllListeners("reject-call");
      socket.removeAllListeners("end-call");
      
      
      
    };
  },[])

  


  let isLoading = isBeingCalled || isCalling;
  const userToCall = remoteUser?remoteUser: "yared";

const endCall=()=>{
  // setCallAccepted(false)
    setIsCalling(false)
    setIsAnswered(false)
    setIsBeingCalled(false)
  socket.emit('end-call',{from:user.id,to:remoteUser.id?remoteUser.id:remoteUser._id})
  
}



  const startCall=()=>{
      socket.emit("start-call", {from:user,to:userToCall})
      setIsCalling(true)
  }
  const handleCacel = () => {
    socket.emit("cancel-call",{from:user,to:userToCall})
    setIsCalling(false);
  };

  const toggleCamera = () => {
    // console.log('toggleCamera')
    // console.log(remoteUser)
    // socket.emit('toggle-cam',{from:user.id,to:remoteUser.id?remoteUser.id:remoteUser._id})
    console.log('toggle-cam')
    console.log(myVideo.srcObject)
    if (localStream) {
      let videoTrack = localStream
        .getTracks()
        .find((track) => track.kind === "video");
      videoTrack.enabled = !videoTrack.enabled;
      setIsVidEnabled(videoTrack.enabled);
    }
  };
  const toggelMic = () => {
    if (localStream) {
      let audioTrack = localStream
        .getTracks()
        .find((track) => track.kind === "audio");
      audioTrack.enabled = !audioTrack.enabled;
      console.log(audioTrack.enabled);
      setIsMicEnabled(audioTrack.enabled);
    }
  };

  // const handleUserVidToggle = () => {
  //   console.log('toggle cam received')
  //   if (remoteStream) {
  //     let videoTrack = remoteStream
  //       .getTracks()
  //       .find((track) => track.kind === "video");
  //     videoTrack.enabled = !videoTrack.enabled;
  //     setIsUserVidEnabled(videoTrack.enabled);
      
  //   }

  // };
  

  return (
    <div
      className={`${"flex flex-col justify-between items-center w-full  h-full p-8 pb-32 bg-[#dafdea] relative gap-y-10"}`}
    >
      {isBeingRequested&& caller&&   <MyNotificaiton caller={caller} onAcceptRequest={onAcceptRequest} onRejectRequest={onRejectRequest}   />}
      <ToastContainer />
      {/* <AppBar/> */}
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

      <div className="flex justify-between items-center gap-x-10">
        {isBeingCalled && !isAnswered && (
          <>
            <button className="font-Roboto text-[24px] text-white hover:text-[#f5f5dc] bg-[#1dad00] px-3 py-2 rounded-[20px] hover:bg-[#116700]" onClick={handleAnswerCall}>
              Answer call
            </button>
            <button className="font-Roboto text-[24px] text-white hover:text-[#f5f5dc] bg-[#cd3740] px-3 py-2 rounded-[20px] hover:bg-[#ad001d]" onClick={handleRejectCall}>
              Reject call
            </button>
          </>
        )}

        {!isBeingCalled  &&  (
          <>
            <button
              className={`font-Roboto text-[24px] text-white hover:text-[#f5f5dc] ${
                !isCalling
                  ? "bg-[#2d75ef] cursor-pointer hover:bg-[#0b3377]"
                  : "bg-[#848484]"
              } px-3 py-2 rounded-[20px] `}
              disabled={isCalling}
              onClick={startCall}
            >
              call {userToCall.username}
            </button>
            <button
              className={`font-Roboto text-[24px] text-white hover:text-[#f5f5dc] ${
                isCalling
                  ? "bg-[#cd3740] cursor-pointer hover:bg-[#0b3377]"
                  : "bg-[#848484]"
              } px-3 py-2 rounded-[20px] `}
              disabled={!isCalling}
              onClick={handleCacel}
            >
              cancel call
            </button>
          </>
        )}
      </div>

      <Controls
        isMicEnabled={isMicEnabled}
        isVidEnabled={isVidEnabled}
        isAnswered={isAnswered}
        setIsAnswered={setIsAnswered}
        toggelMic={toggelMic}
        toggleCamera={toggleCamera}
        endCall={endCall}
      />
    </div>
  );
};

export default VideoPlayer;
