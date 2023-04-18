
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import Chat from "./pages/ChatPage";
import { useState,createContext } from "react";

export const userContext=createContext();
function App() {
  const [user,setUser] = useState(null)
    

  return (
    <userContext.Provider  value={{user,setUser}}>
      <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
     <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage/>} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/chat" element={<Chat/>} />
        </Routes>
      </BrowserRouter>
    </div>
  </div>
    </userContext.Provider>
  );
}

export default App;
