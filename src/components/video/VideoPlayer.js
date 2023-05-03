import React, { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "./context";
import { socket } from "../../socket";
import ReactLoading from "react-loading";

import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import AppBar from "./AppBar";
import { useLocation, useNavigate } from "react-router";
import { appContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLastfmSquare } from "react-icons/fa";
import MyNotificaiton from "./notification";
import { stopBothVideoAndAudio } from "../../utils/stream";
import Controls from "./Controls";
import Audio from "./Audio";
import MyVideos from "./MyVideos";
import Timer from "./Timer";
import {AiFillHome} from 'react-icons/ai'

const VideoPlayer = () => {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  const [isVidEnabled, setIsVidEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [caller, setCaller] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [isVideoCall, setIsVideoCall] = useState(true);

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
  console.log("to check if video ")
  console.log("isVideo ",isVideo)
  console.log("isVideoCall ",isVideoCall)

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

  const navigate = useNavigate();

  const handleReceiveAccept = () => {
    console.log("Receive Accept");
    setRequestAccepted(true);
    callUser();
  };
  const handleReceiveReject = () => {
    console.log("Receive reject");
    setIsCalling(false);
    setRequestRejected(true);
    notify("Call rejected");
  };

  const onAcceptRequest = () => {
    socket.emit("accept-request", { from: user.id, to: caller.id });
    console.log("Accept request ", caller);
    setIsBeingCalled(true);
    setRequestAccepted(true);
    setIsBeingRequested(false);
    clearTimeout(timeoutId);
    navigate("/videoCall", {
      state: {
        isVideo: isVideoCall,
        remoteUser: caller,
      },
    });
  };
  const onRejectRequest = () => {
    // socket.emit()
    socket.emit("reject-request", { from: user.id, to: caller.id });
    setCaller(null);
    clearTimeout(timeoutId);
    setIsBeingRequested(false);
  };

  const handleAnswerCall = () => {
    answerCall({ from: remoteUser.id, to: user.id });
    setIsBeingCalled(false);
    setIsAnswered(true);
  };
  const handleRejectCall = () => {
    socket.emit("reject-call", { from: user.id, to: remoteUser.id });
    setIsBeingCalled(false);
    // setIsAnswered(false)
  };

  const handleEndCall = () => {
    // setCallAccepted(false)
    setIsCalling(false);
    setIsAnswered(false);
    setIsBeingCalled(false);
    notify("call ended");
    // stopBothVideoAndAudio(rs.current)

    // setIsAnswered(true)
  };

  const handleReceiveCall = ({ from, to, isVideo }) => {
    console.log("call received from vp ");
    setIsVideoCall(isVideo)
    setCaller(from);
    setIsBeingRequested(true);
    // console.log(isBeingRequested)
    // console.log(caller)

    const ti = setTimeout(() => {
      console.log("time out executed from vp");
      socket.emit("reject-request", { from: to._id, to: from.id });
      setIsBeingRequested(false);
    }, 11000);
    setTimeoutId(ti);

    console.log("timeout id from vp: ", ti);
  };

  const handleCancelCall = ({ from, to }) => {
    console.log("call cnacelled ");

    notify("call cnacelled");
    setCaller(null);
    clearTimeout(timeoutId);

    setIsBeingRequested(true);
    setIsBeingCalled(false);
  };
  const handleReceiveRejectCall = ({ from, to }) => {
    console.log("call rejecte received ");

    notify("call rejected");
    setIsCalling(false);
  };

  const notify = (text) => toast.error(text);

  useEffect(() => {
    socket.on("receive-call", handleReceiveCall);
    socket.on("cancel-call", handleCancelCall);

    return () => {
      console.log("cleared video player timeoutid");
      socket.removeAllListeners("receive-call");
      socket.removeAllListeners("cancel-call");
    };
  }, [timeoutId]);

  useEffect(() => {
    socket.on("reject-request", handleReceiveReject);
    socket.on("accept-request", handleReceiveAccept);
    socket.on("end-call", handleEndCall);
    socket.on("reject-call", handleReceiveRejectCall);

    return () => {
      console.log("video player cleared");
      if (localStream) {
        stopBothVideoAndAudio(localStream);
      }
      socket.removeAllListeners("accept-request");
      socket.removeAllListeners("reject-request");
      socket.removeAllListeners("reject-call");
      socket.removeAllListeners("end-call");
    };
  }, []);

  let isLoading = isBeingCalled || isCalling;
  const userToCall = remoteUser ? remoteUser : "yared";

  const endCall = () => {
    // setCallAccepted(false)
    setIsCalling(false);
    setIsAnswered(false);
    setIsBeingCalled(false);
    socket.emit("end-call", {
      from: user.id,
      to: remoteUser.id ? remoteUser.id : remoteUser._id,
    });
    // peerConnection.current.close()
    // peerConnection.current=null
    // console.log('peerConnection ',peerConnection.current)
    // console.log('remoteStream before ',rs.current)
    // stopBothVideoAndAudio(rs.current)
    // console.log('remoteStream after ',rs.current)
  };

  const startCall = () => {
    socket.emit("start-call", { from: user, to: userToCall, isVideo });
    console.log("starting a call ", userToCall);
    setIsCalling(true);
  };
  const handleCacel = () => {
    socket.emit("cancel-call", { from: user, to: userToCall });
    setIsCalling(false);
  };

  const toggleCamera = () => {
    // console.log('toggleCamera')
    // console.log(remoteUser)
    // socket.emit('toggle-cam',{from:user.id,to:remoteUser.id?remoteUser.id:remoteUser._id})
    console.log("toggle-cam");
    console.log(myVideo.srcObject);
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

 

  return (
    <div
      className={`${"flex flex-col justify-between items-center w-full  h-full p-8 pb-32 bg-[#dafdea] relative gap-y-10"}`}
    >
      {isBeingRequested && caller && (
        <MyNotificaiton
          caller={caller}
          isVideo={isVideoCall}
          onAcceptRequest={onAcceptRequest}
          onRejectRequest={onRejectRequest}
        />
      )}
      <ToastContainer />
      {/* <AppBar/> */}

      {!isAnswered &&(!isBeingCalled && !isCalling) && <div className="absolute top-6 left-10 flex mb-3 justify-start items-center gap-44">
        <AiFillHome onClick={()=>navigate('/chat')} className="h-8 w-8 text-[#991e1e] cursor-pointer"/>
        <span className="text-4xl font-Roboto text-[#7036ab]" >{(!isVideo || !isVideoCall)? "Audio Call":"Video Call"}</span>
        </div>}

      {isAnswered && <Timer/>}

      {
        !isVideoCall|| !isVideo? <Audio myVideo={myVideo} userVideo={userVideo} userToCall={userToCall} isLoading={isLoading} />:
       <MyVideos myVideo={myVideo} userVideo={userVideo} userToCall={userToCall} isLoading={isLoading} isVidEnabled={isVidEnabled} />

      }

      

      <div className="flex justify-between items-center gap-x-10">
        {isBeingCalled && !isAnswered && (
          <>
            <button
              className="font-Roboto text-[24px] text-white hover:text-[#f5f5dc] bg-[#1dad00] px-3 py-2 rounded-[20px] hover:bg-[#116700]"
              onClick={handleAnswerCall}
            >
              Answer call
            </button>
            <button
              className="font-Roboto text-[24px] text-white hover:text-[#f5f5dc] bg-[#cd3740] px-3 py-2 rounded-[20px] hover:bg-[#ad001d]"
              onClick={handleRejectCall}
            >
              Reject call
            </button>
          </>
        )}





        {!isBeingCalled && !isAnswered &&  (
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
        isVideo={isVideo}
      />
    </div>
  );
};

export default VideoPlayer;
