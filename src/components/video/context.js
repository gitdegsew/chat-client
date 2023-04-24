import React, { createContext, useState, useRef, useEffect } from "react";
import { socket } from "../../socket";
import VideoPlayer from "./VideoPlayer";

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

  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [name, setName] = useState("");
  const [call, setCall] = useState(null);
  const [remoteUser, setRemoteUser] = useState(null);

  // const [userLoggedIn, setUserLoggedIn] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef(null);
  function refreshPage() {
    window.location.reload(false);
  }
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((currentStream) => {
        setLocalStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });

    socket.connect();
    socket.emit("login", user.id);

    socket.on("receive-offer", ({ offer, from, to }) => {
      setCall({ offer, from, to });

      // answerCall({ offer, from, to });
    });

    socket.on("receive-answer", ({ answer, from, to }) => {
      console.log('event received')
      addAnswer(answer);
      
    });
    socket.on("receive-candidate", ({ candidate, userId }) => {
      if (connectionRef.current) {
        connectionRef.current.addIceCandidate(candidate, userId);
      }
    });
    socket.on("user-loggedIn", ({ userId }) => {

      console.log("user has logged in  " + userId);
      setRemoteUser(userId);
      // setUserLoggedIn(true)
      // callUser(userId)
    });

    socket.on("logout", (userId) => {
      setRemoteUser(null);
      console.log("user logged out " + userId);
      socket.removeAllListeners("user-logdedIn");
      socket.removeAllListeners("receive-offer");
      socket.removeAllListeners("receive-answer");
      socket.removeAllListeners("receive-candidate");
      socket.removeAllListeners("logout");
    });

    return () => {
      console.log("one kiss")
      socket.removeAllListeners("user-logdedIn");
      socket.removeAllListeners("receive-offer");
      socket.removeAllListeners("receive-answer");
      socket.removeAllListeners("receive-candidater");
      socket.removeAllListeners("logout");
    };
  }, []);

  const answerCall = async ({ offer, from, to }) => {
    
    await createPeerConnection(from);
    let peerConnection = connectionRef.current;

    try {
      await peerConnection.setRemoteDescription(offer);
    } catch (error) {
      console.log("remot description error");
      console.log(error);
    }
    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("send-answer", { answer, from: to, to: from });

    setCallAccepted(true)
  };

  const callUser = async (userId) => {
    console.log("callUser is called");
    await createPeerConnection(userId);

    let peerConnection = connectionRef.current;

    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit("send-offer", { offer, from: user.id, to: userId });
  };

  const addAnswer = async (answer) => {
    let peerConnection = connectionRef.current;
    
      console.log("add answer is called");
      await peerConnection.setRemoteDescription(answer);
      setCallAccepted(true)
    
  };

  const createPeerConnection = async (userId) => {
    console.log("createPeerConnection called ", userId);
    const peerConnection = new RTCPeerConnection(servers);
    connectionRef.current = peerConnection;

    setRemoteStream(new MediaStream());
    userVideo.current.srcObject = remoteStream;

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
    }

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        if (remoteStream) {
          remoteStream.addTrack(track);
        }
      });
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("send-candidate", {
          candidate: event.candidate,
          from: user.id,
          to: userId,
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
        remoteStream
      }}
    >
      <VideoPlayer callAccepted={callAccepted}/>
      {remoteUser && (
        <button
          onClick={() => {
            callUser(remoteUser);
          }}
        >
          call user
        </button>
      )}
      {call && (
        <button
          onClick={() => {
            answerCall({ offer: call.offer, from: call.from, to: call.to });
          }}
        >
          answer call
        </button>
      )}

<button onClick={refreshPage}>Click to reload!</button>
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
