import React, { createContext, useState, useRef, useEffect,createElement, useCallback, useContext } from "react";
import { socket } from "../../socket";
import VideoPlayer from "./VideoPlayer";
import { FaChrome } from "react-icons/fa";
import ReactPlayer from "react-player";
import Controls from "./Controls";
import { useLocation } from "react-router";
import { appContext } from "../../App";

const SocketContext = createContext();

// const socket = io('https://warm-wildwood-81069.herokuapp.com');
const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
};
const ContextProvider = () => {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  
  const [callEnded, setCallEnded] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [name, setName] = useState("");
  const [call, setCall] = useState(null);
  // const [remoteUser, setRemoteUser] = useState(null);
  const [isCalling,setIsCalling] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false);
  const [callAccepted, setCallAccepted] =useState(false)
  

  // const [userLoggedIn, setUserLoggedIn] = useState(false);

  const  {
    isBeingCalled,
    requestRejected,
    requestAccepted,
    setIsBeingCalled,
    setRequestAccepted,
    setRequestRejected
  }=useContext(appContext)

  const location= useLocation()
  const {remoteUser}=location.state
  

  const myVideo = useRef();
  const userVideo = useRef();
  const rs = useRef(null);
  const peerConnection = useRef();
  
  const askForDevicePermission =useCallback(()=>{
    navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((currentStream) => {
      setLocalStream(currentStream);
        currentStream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, currentStream);
      
    });
      myVideo.current.srcObject = currentStream;
      
    });
  },[])
  

  useEffect(() => {

    const pc=new RTCPeerConnection(servers)
    peerConnection.current=pc

   askForDevicePermission()

    // socket.connect();
    // socket.emit("login", user);
    
    peerConnection.current.current=pc
    peerConnection.current.ontrack = (event) => {
      console.log('track added')
      setRemoteStream(event.streams[0])
      userVideo.current.srcObject=event.streams[0]
      // console.log("uservideo", userVideo.current.srcObject)
      // event.streams[0].getTracks().forEach((track) => {
      //   if (remoteStream) {
      //     console.log('track added')
      //     remoteStream.addTrack(track);
      //   }
      // });
    };

    socket.on("receive-offer", ({ offer, from, to }) => {
      console.log('offer received')
      
      setCall({ offer, from, to });
      prepareForAnswer({offer, from, to})

      // answerCall({ offer, from, to });
    });

    socket.on("receive-answer", ({ answer, from, to }) => {
      console.log('answer received')
      addAnswer(answer);
      
    });
    socket.on("receive-candidate", ({ candidate, from,to }) => {
      
      if (peerConnection.current) {
        console.log('candidates added')

        try {
          peerConnection.current.addIceCandidate(candidate);
        } catch (error) {
          console.log(error)
        }
      }
    });
    // socket.on("user-loggedIn", ({ user }) => {

    //   console.log("user has logged in  " + user.id);
    //   setRemoteUser(user);
    //   // setUserLoggedIn(true)
    //   // callUser(userId)
    // });

    // socket.on("logout", (userId) => {
    //   setRemoteUser(null);
    //   console.log("user logged out " + userId);
      
    // });

    


    return () => {
      console.log("cleared")
      socket.removeAllListeners("user-logdedIn");
      socket.removeAllListeners("receive-offer");
      socket.removeAllListeners("receive-answer");
      socket.removeAllListeners("receive-candidater");
      socket.removeAllListeners("logout");
    };
  }, []);

  

  const answerCall = async ({ offer, from, to }) => {
    
     
    console.log("answerCall",)
    console.log(from)
    console.log(to)

    
    let answer = await peerConnection.current.createAnswer();
    try {
      await peerConnection.current.setLocalDescription(answer);
    } catch (error) {
      console.log("local answer error");
    }
    socket.emit("send-answer", { answer, from: to, to: from });

    // setCallAccepted(true)
    console.log(peerConnection.current.iceConnectionState)
  };
   
  const prepareForAnswer = async({offer,from,to})=>{
    createPeerConnection(from);
    // let peerConnection.current = connectionRef.current;
    try {
      rs.current=remoteStream
      await peerConnection.current.setRemoteDescription(offer);
      // answerCall({offer,from,to})
      
        
      
    } catch (error) {
      console.log("remote offer error");
      console.log(error);
    }
  }

  const callUser = async () => {

    console.log("callUser is called");
    
    createPeerConnection(remoteUser._id);
    // let peerConnection.current = connectionRef.current;
    
    let offer = await peerConnection.current.createOffer();
    try {
      await peerConnection.current.setLocalDescription(offer);
    } catch (error) {
      console.log("local offer error")
    }

    socket.emit("send-offer", { offer, from: user, to: remoteUser });
    // console.log(peerConnection.current.iceConnectionState)
  };

  const addAnswer = async (answer) => {
    // let peerConnection.current = connectionRef.current;
    
      console.log("add answer is called");
      try {
        rs.current=remoteStream
        await peerConnection.current.setRemoteDescription(answer);
        
      } catch (error) {
        console.log('remote answer error')
        console.log(error)
        
      }
      setIsAnswered(true)
      console.log(peerConnection.current.iceConnectionState)
    
  };

  const createPeerConnection = (userId) => {
    // console.log("createPeerConnection called ", userId);
    // const peerConnection.current = new RTCPeerConnection.current(servers);
    // connectionRef.current = peerConnection.current;

    peerConnection.current.onconnectionstatechange = (ev) => {
      switch (peerConnection.current.connectionState) {
        case "new":
        case "checking":
          console.log("Connecting…");
          break;
        case "connected":
          // userVideo.current.srcObject=remoteStream
          console.log("Online");
          break;
        case "disconnected":
          console.log("Disconnecting…");
          break;
        case "closed":
          console.log("Offline");
          break;
        case "failed":
          console.log("Error");
          break;
        default:
          console.log("Unknown");
          break;
      }
    };
    
    // setRemoteStream(new MediaStream());
    // userVideo.current.srcObject = remoteStream;

    // if (localStream) {
    //   localStream.getTracks().forEach((track) => {
    //     peerConnection.current.addTrack(track, localStream);
    //   });
    // }

    // peerConnection.current.ontrack = (event) => {
    //   console.log('track added')
    //   userVideo.current.srcObject=localStream
    //   console.log("uservideo", userVideo.current.srcObject)
    //   // event.streams[0].getTracks().forEach((track) => {
    //   //   if (remoteStream) {
    //   //     console.log('track added')
    //   //     remoteStream.addTrack(track);
    //   //   }
    //   // });
    // };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('candidate emitted')
        socket.emit("send-candidate", {
          candidate: event.candidate,
          from: user,
          to: remoteUser,
        });
      }
    };
  };

  const handleLogOut = () => {
    // connectionRef.current=null
  };


  return (
    <SocketContext.Provider
      value={{
        myVideo,
        userVideo,
        remoteStream,
        localStream,
        isCalling,
        setIsCalling,
        callUser,
        setCallAccepted,
        answerCall,
        remoteUser,
        isAnswered,
        setIsAnswered
      }}
      
    >
      {remoteUser && <VideoPlayer/>}

      
      
    
    


    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
