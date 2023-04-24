
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



function App() {
  
    

  return (
    
      <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className=" w-full space-y-8 flex justify-center items-center text-center">
     <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage/>} />
            <Route path="/videocall" element={<ContextProvider/>}/>
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/chat" element={<Chat/>} />
        </Routes>
      </BrowserRouter>
    </div>
  </div>
   
  );
}

export default App;
