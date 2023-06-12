import {
  BrowserRouter,
  Routes,
  Route,
  useBeforeUnload,
} from "react-router-dom";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import Chat from "./pages/ChatPage";
import VideoPage from "./pages/VideoPage";
import { ContextProvider } from "./components/video/context";
import Login from "./components/Login";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaRegClosedCaptioning } from "react-icons/fa";
import { socket } from "./socket";
import { updateUnseen } from "./utils/api";

const appContext = createContext();

function App() {
  const [isBeingCalled, setIsBeingCalled] = useState(false);
  const [isBeingRequested, setIsBeingRequested] = useState(false);
  const [requestAccepted, setRequestAccepted] = useState(false);
  const [requestRejected, setRequestRejected] = useState(false);
  const [onlineUsers, setOnlineusers] = useState([]);
  const [percentageT, setPercentage] = useState(0);
  const [unseen, setUnseen] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [beingTyped, setBeingTyped] = useState([]);
  const typing = useRef(new Map()).current;

  useEffect(() => {
    socket.on("istyping", (data) => {
      const check = data.isPrivate ? data.from.id : data.to;
      const filterd = beingTyped.filter((item) => item !== check);
      if (!data.isPrivate) {
        if (!typing.get(check)) {
          typing.set(check, [data.from.username]);
        } else {
          typing.set(check, [...typing.get(check), data.from.username]);
        }
      }
      setBeingTyped([...filterd, check]);
      setIsTyping(true);
    });

    socket.on("finished", (data) => {
      const check = data.isPrivate ? data.from.id : data.to;
      const filterd = beingTyped.filter((item) => item !== check);
      if (!data.isPrivate) {
        typing.set(
          check,
          typing.get(check).filter((item) => item !== data.from.username)
        );
      }
      setBeingTyped([...filterd]);
      setIsTyping(false);
    });
    return () => {
      socket.removeAllListeners("istyping");
      socket.removeAllListeners("finished");
    };
  }, [beingTyped]);

  useEffect(() => {
    console.log("app useEffect is called online");
    socket.on("onlineUsers", (data) => {
      setOnlineusers(data);
    });
    socket.on("user-loggedout", (data) => {
      console.log("from application logout");
      console.log(data);
      setOnlineusers(data);
    });

    return () => {
      console.log("app is cleared onlineUser");
      socket.removeAllListeners("onlineUsers");
      socket.removeAllListeners("user-loggedout");
    };
  }, [onlineUsers]);

  return (
    <appContext.Provider
      value={{
        isBeingRequested,
        setIsBeingRequested,
        isBeingCalled,
        requestRejected,
        requestAccepted,
        setIsBeingCalled,
        setRequestAccepted,
        setRequestRejected,
        onlineUsers,
        percentageT,
        setPercentage,
        unseen,
        setUnseen,
        isTyping,
        beingTyped,
        typing,
      }}
    >
      <div className="min-h-full  h-screen flex items-center justify-center">
        <div className=" w-full bg-white p-8 md:w-4/5 lg:w-3/5 lg:py-20 mx-10 md:p-8  space-y-8 flex justify-center items-center text-center rounded-lg">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/videocall" element={<ContextProvider />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </appContext.Provider>
  );
}

export default App;
export { appContext };
