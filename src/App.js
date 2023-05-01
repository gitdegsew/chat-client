
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import Chat from "./pages/ChatPage";
import VideoPage from "./pages/VideoPage";
import { ContextProvider } from "./components/video/context";
import Login from "./components/Login";
import { createContext, useContext, useEffect, useState } from "react";
import { FaRegClosedCaptioning } from "react-icons/fa";
import { socket } from "./socket";




const appContext = createContext()

function App() {
  const [isBeingCalled,setIsBeingCalled] = useState(false)
  const [isBeingRequested,setIsBeingRequested] = useState(false)
  const [requestAccepted,setRequestAccepted] =useState(false)
  const [requestRejected,setRequestRejected] = useState(false)
  const [onlineUsers,setOnlineusers] = useState([])
 

  useEffect(()=>{
    console.log('app useEffect is called')
    socket.on('onlineUsers',(data)=>{
      // console.log('from application')
      // console.log(data)
      setOnlineusers(data)
    })
    socket.on('user-loggedout',(data)=>{
      // console.log('from application logout')
      // console.log(data)
      setOnlineusers(data)
    })

    // socket.on('user-loggedIn',(data)=>{
    //   setUserLoggedIn(data)
    //   console.log('from app user logged in')
    //   console.log(data)
    //   setOnlineusers([...onlineUsers,data])
    // })
    return ()=>{
      // console.log('app is cleared')
      socket.removeAllListeners('onlineUsers')
      socket.removeAllListeners('user-loggedout')
    }
  },[onlineUsers])
  

  return (
    <appContext.Provider
    value={
      {
        isBeingRequested,
        setIsBeingRequested,
        isBeingCalled,
        requestRejected,
        requestAccepted,
        setIsBeingCalled,
        setRequestAccepted,
        setRequestRejected,
        onlineUsers,
       
      }
    }
    >
       <div className="min-h-full h-screen flex items-center justify-center">
    <div className=" w-full space-y-8 flex justify-center items-center text-center">
     <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage/>} />
            <Route path="/videocall" element={<ContextProvider/>}/>
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  </div>
    </appContext.Provider>
     
   
  );
}

export default App;
export {appContext}
