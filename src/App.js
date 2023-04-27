
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
import { createContext, useContext, useState } from "react";
import { FaRegClosedCaptioning } from "react-icons/fa";



const appContext = createContext()

function App() {
  const [isBeingCalled,setIsBeingCalled] = useState(false)
  const [requestAccepted,setRequestAccepted] =useState(false)
  const [requestRejected,setRequestRejected] = useState(false)

  
  

  return (
    <appContext.Provider
    value={
      {
        isBeingCalled,
        requestRejected,
        requestAccepted,
        setIsBeingCalled,
        setRequestAccepted,
        setRequestRejected
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
