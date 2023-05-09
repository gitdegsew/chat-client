import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  createContext,
} from "react";
import SideBar from "../components/SideBar";
import Chats from "../components/Chats";
import CurrentChat from "../components/CurrentChat";
import { socket } from "../socket";
import { getUsers, getGroups, updateUnseen,getUser, getUserGroups} from "../utils/api";
import { appContext, userContext } from "../App";
import MyNotificaiton from "../components/video/notification";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useBeforeUnload } from "react-router-dom";

const pageContext = createContext();
const ChatPage = () => {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [tabSelected, setTabSelected] = useState("All chats");
  const [isLoading, setLoading] = useState(true);
  const [chatSelected, setChatSelected] = useState(null);
  const [messageToSend, setMessageToSend] = useState(null);
  const [chats, setChats] = useState([]);
  const [caller, setCaller] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [fileshare, setFileshare] = useState({});
  const [timeoutId, setTimeoutId] = useState(null);
  const [updatedItem, setUpdatedItem] = useState(null);
  const [percent, setPercent] = useState(0);
  const [isVideoCall, setIsVideoCall] = useState(true);

  const {
    isBeingRequested,
    setIsBeingRequested,
    isBeingCalled,
    requestRejected,
    requestAccepted,
    setIsBeingCalled,
    setRequestAccepted,
    setRequestRejected,
    unseen,
    setUnseen,
   
  } = useContext(appContext);

  // const [calling,setCalling]=useState(false)

  // const [notification,setNotification] = useState([])
  const count = useRef([]);

  const navigate = useNavigate();

  const [error, setError] = useState(null);
  
  useBeforeUnload(
    useCallback(() => {
      
        console.log('unseen from page ',unseen)
      
        updateUnseen(user.accessToken,user.id,unseen)
      
    }, [unseen])
  );


  const notify = (text) => toast.error(text);
  const download = (data, file) => {
    let a = document.createElement("a");
    a.href = file;
    a.download = data.metadata.filename;
    a.click();
  };

  const handleMsgReceived = (data) => {
    console.log("event received from page");

    const check = data.isPrivate ? data.from : data.to;
    

    if (chatSelected && check === chatSelected._id) {
      setChats([...chats, data]);
    }
    
  };

  const handleMsgReceivedOne = (data) => {
    console.log(" another event received from page");

    setReceivedMessage(data);
    const check = data.isPrivate ? data.from : data.to;
    if(!chatSelected || check !== chatSelected._id) {
      
      
      setUnseen([...unseen, {check,isPrivate:data.isPrivate}]);
    }

    
  };

  useEffect(() => {
    return () => {
      socket.off("send-msg", handleMsgReceived);
    };
  });



  const sharefiles = useCallback(({ buffer, from, to }) => {
    console.log("shared files", buffer);
    const sender = sessionStorage.getItem("username");
    fileshare.buffer.push(buffer);
    console.log(
      (fileshare.transferred * 100) / fileshare.metadata.max_buffer_size
    );
    setPercent(
      (fileshare.transferred * 100) / fileshare.metadata.max_buffer_size
    );
    fileshare.transferred += buffer.byteLength;
    const percentage =Math.round(100*fileshare.transferred/fileshare.metadata.max_buffer_size)
    // setFileupload(Math.round(100*fileshare.transferred/fileshare.metadata.max_buffer_size)  + "%")
    if (fileshare.transferred === fileshare.metadata.max_buffer_size) {
      console.log("download complete");
      // setFileupload()

      const blob = new Blob(fileshare.buffer, {
        type: fileshare.metadata.filetype,
      });
      let file = URL.createObjectURL(blob);

      if (fileshare.metadata.filetype.includes("image")) {
        const from = fileshare.metadata.from;
        const message = file;
        const sender = fileshare.metadata.sender;
        const to = fileshare.metadata.to;
        const isPrivate = fileshare.metadata.isPrivate;
        const dataTosave = {
          from,
          to,
          message,
          messageType: "image",
          isPrivate,
          sender,
          createdAt: fileshare.metadata.createdAt,
        };

        setReceivedMessage(dataTosave);
        const check = fileshare.metadata.isPrivate ? fileshare.metadata.from : fileshare.metadata.to;
        if(!chatSelected || check !== chatSelected._id) {
          
          setUnseen([...unseen, {check,isPrivate:fileshare.metadata.isPrivate}]);
        }
        
        // myChats.current=[...myChats.current,dataTosave]
        // console.log('from sharefile')
        console.log("before", chats);
        setChats([...chats, dataTosave]);

        console.log("after", chats);
        // setAllMessages((list)=>[...list,{fr, message, reciever, messagetype:"image"}])
      }else if (fileshare.metadata.filetype.includes("video")) {
        const from = fileshare.metadata.from;
        const message = file;
        const sender = fileshare.metadata.sender;
        const to = fileshare.metadata.to;
        const isPrivate = fileshare.metadata.isPrivate;
        const dataTosave = {
          from,
          to,
          message,
          messageType: "video",
          isPrivate,
          sender,
          createdAt: fileshare.metadata.createdAt,
        };

        setReceivedMessage(dataTosave);
        const check = fileshare.metadata.isPrivate ? fileshare.metadata.from : fileshare.metadata.to;
        if(!chatSelected || check !== chatSelected._id) {
          setUnseen([...unseen, {check,isPrivate:fileshare.metadata.isPrivate}]);
        }
        // myChats.current=[...myChats.current,dataTosave]
        // console.log('from sharefile')
        console.log("before", chats);
        setChats([...chats, dataTosave]);

        console.log("after", chats);
        // setAllMessages((list)=>[...list,{fr, message, reciever, messagetype:"image"}])
      } 
       else {
        const sender = fileshare.metadata.sender;
        const isPrivate = fileshare.metadata.isPrivate;

        const dataTosave = {
          from,
          to,
          message: fileshare.metadata.filename,
          messageType: "non-text",
          isPrivate,
          sender,
          createdAt: fileshare.metadata.createdAt,
        };

        setChats([...chats, dataTosave]);
        setReceivedMessage(dataTosave);
        const check = fileshare.metadata.isPrivate ? fileshare.metadata.from : fileshare.metadata.to;
        if(!chatSelected || check !== chatSelected._id) {
          
          setUnseen([...unseen, {check,isPrivate:fileshare.metadata.isPrivate}]);
        }
        // setReceivedMessage({
        //   from,to,message,messagetype:'non-text',isPrivate
        // })

        // setAllMessages((list)=>[...list,fileshare.metadata])
        console.log(fileshare.metadata.filetype.includes("images"));
        download(fileshare, file);
      }
    } else {
      socket.emit("fs-start", {
        from: to,
        to: from,
        isPrivate: true,
        percentage:percentage
      });
    }
  },[unseen,chats])

  if (chatSelected) {
    // socket.removeListener('send-msg')

    // socket.on('file-raw',sharefiles)
    socket.on("send-msg", handleMsgReceived);
  }

  useEffect(() => {
    socket.on("file-meta", (metadata) => {
      console.log("file meta received", metadata);
      fileshare.metadata = metadata;

      fileshare.transferred = 0;
      fileshare.buffer = [];
      socket.emit("fs-start", {
        from: user.id,
        to: metadata.from,
        isPrivate: true,
        percentage:0
      });
    });

    socket.on("file-raw", sharefiles);
    socket.on("send-msg", handleMsgReceivedOne);

    return () => {
      console.log("ratnesss cleared");
      socket.removeAllListeners("file-meta");
      socket.removeAllListeners("file-raw");
      socket.off("send-msg", handleMsgReceivedOne);
    };
  }, [chats,unseen]);

  // useEffect(()=>{

  //     socket.removeAllListeners('file-meta')
  //     socket.off('file-raw')
  //     socket.removeAllListeners('send-msg')

  // },[chats])
  // shared files

  const onAcceptRequest = () => {
    socket.emit("accept-request", { from: user.id, to: caller.id });
    setIsBeingCalled(true);
    setRequestAccepted(true);
    setIsBeingRequested(false);
    console.log("accept-request: ", timeoutId);
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
    setRequestRejected(true);
    setIsBeingRequested(false);
  };

  const handleReceiveCall = ({ from, to, isVideo }) => {
    console.log("call received ");

    setIsVideoCall(isVideo);
    setCaller(from);
    setIsBeingRequested(true);
    setIsVideoCall(isVideo);

    const ti = setTimeout(() => {
      console.log("time out executed");
      socket.emit("reject-request", { from: to._id, to: from.id });
      setIsBeingRequested(false);
    }, 11000);
    setTimeoutId(ti);

    console.log("timeout id: ", ti);
  };
  const handleCancelCall = ({ from, to }) => {
    console.log("call cnacelled ");

    notify("call cnacelled");
    setCaller(null);
    clearTimeout(timeoutId);

    setIsBeingRequested(true);
    setIsBeingCalled(false);
  };

  // video call

  useEffect(() => {
    socket.on("receive-call", handleReceiveCall);
    socket.on("cancel-call", handleCancelCall);

    return () => {
      console.log("cleared chat page");
      socket.removeAllListeners("receive-call");
      socket.removeAllListeners("cancel-call");
    };
  }, [timeoutId]);

  useEffect(() => {
    getUsers(user.accessToken, user.id)
      .then((users) => {
        setUsers(users);

        getUserGroups(user.accessToken,user.id).then((groups) => {
          setGroups(groups);
          setLoading(false);
        });
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });

      getUser(user.accessToken, user.id).then((user) =>{
        setUnseen(user.unseen)
      }).catch((error) =>{
        console.log('unseen error')
      })
    
    // console.log('socket connected from chat page before ',socket)
    // if(socket.connected){
    //   socket.connected = false
    // }
    // console.log('socket connected from chat page after ',socket)
    try {
      socket.connect();
      socket.emit("login", user);
    } catch (error) {

      console.log('error trying to connect again')
      console.log(error)
      
    }
  }, []);

  return (
    <pageContext.Provider
      value={{
        receivedMessage,
        updatedItem,
        setUpdatedItem,
        setGroups,
        groups,
        percent,
        setChatSelected,
        setChats,
        chats,
        setMessageToSend
      }}
    >
      <div className="flex gap-x-2 justify-start  left-0 top-0 w-full fixed ">
        {isLoading && !error ? (
          <p>loading...</p>
        ) : !isLoading && error ? (
          <p>{error}</p>
        ) : (
          <>
            {isBeingRequested && caller && (
              <MyNotificaiton
                caller={caller}
                isVideo={isVideoCall}
                onAcceptRequest={onAcceptRequest}
                onRejectRequest={onRejectRequest}
              />
            )}
            <ToastContainer />
            <SideBar
              tabSelected={tabSelected}
              setTabSelected={setTabSelected}
            />
            <Chats
              setGroups={setGroups}
              receivedMessage={receivedMessage}
              messageToSend={messageToSend}
              users={users}
              groups={groups}
              tabSelected={tabSelected}
              setChatSelected={setChatSelected}
              setChats={setChats}
              chatSelected={chatSelected}
            />
            <CurrentChat
              setMessageToSend={setMessageToSend}
              chatSelected={chatSelected}
              chats={chats}
              setChats={setChats}
            />
          </>
        )}
      </div>
    </pageContext.Provider>
  );
};

export default ChatPage;
export { pageContext };
