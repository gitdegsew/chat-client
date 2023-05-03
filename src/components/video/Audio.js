import React, { useContext } from "react";
import { SocketContext } from "./context";
import { appContext } from "../../App";
import ReactLoading from "react-loading";
import LoadingIcons from "react-loading-icons";
import Siriwave from "react-siriwave"

const Audio = ({ userToCall, isLoading }) => {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));

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
  } = useContext(SocketContext);

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

  return (
    

    <div className={`${"flex  justify-center items-center w-full  gap-x-14"}`}>
      <video
        autoPlay
        ref={myVideo}
        className={`w-full  h-72 p-8 bg-black`}
        hidden
      />

      <div className="p-8 flex flex-col justify-center w-full  mt-[-60]  bg-slate-800 text-white  items-center">
        <div className=" rounded-full bg-lime-600 flex justify-center items-center  w-44 h-44">
          <p className="text-9xl">{user.username[0].toUpperCase()}</p>
        </div>
      </div>
      <div className="font-foana" hidden={!isLoading}>
        calling
        <ReactLoading type="bubbles" color="#5d27d1" height={100} width={105} />
      </div>
      <div className="font-foana " hidden={!isAnswered} >
        <LoadingIcons.Audio stroke="#21e7dd" height="5em" width='5em' />
      </div>
      
      
      

      <video
        autoPlay
        ref={userVideo}
        className={`w-full  h-72 p-8 bg-black`}
        hidden
      />

      <div className="p-8 flex flex-col justify-center w-full  mt-[-60]  bg-slate-800 text-white  items-center">
        <div className=" rounded-full bg-lime-600 flex justify-center items-center  w-44 h-44">
          <p className="text-9xl">{userToCall.username[0].toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

export default Audio;

//   </div>
