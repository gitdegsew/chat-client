import React, { useEffect, useState, useContext } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import Chat from "./Chat";
import { pageContext } from "../pages/ChatPage";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import CreateGroup from "./CreateGroup";

const Chats = ({
  users,
  groups,
  tabSelected,
  setChatSelected,
  chatSelected,
  setChats,
  messageToSend,
  counts,
  receivedMessage,
  setGroups,
}) => {
  const allChats = [...users, ...groups];
  const [yo, setYo] = useState([...allChats]);
  const [mcount, setmCount] = useState(0);
  const [isUpdated,setIsUpdated] = useState({})
  const [isHiddden,setIsHiddden] =useState(true)
  // const map=new Map(allChats.map(chat=>[chat,undefined]))
  const lastMessages = React.useRef(new Map());
  const newChats = React.useRef([]);

  // const {
  //   receivedMessage,

  // }=useContext(pageContext)
  const [searchItem, setSearchItem] = useState("");
  console.log("what about chats");
  console.log(lastMessages.current);

  // let newChats

  // useEffect(()=>{





  const handleUpdate =()=>{
    if (mcount >= allChats.length) {
      console.log("guble atifre");
      const nm = new Map([...lastMessages.current].filter((e) => e[1]));
      // console.log(nm)
      const unsortedK = Array.from(nm.keys());
      const unsorted = allChats
        .map((chat, index) => {
          if (unsortedK.includes(chat._id)) return chat;
        })
        .filter((item) => item);
  
      const values = Array.from(nm.values());
      // console.log('values')
      // console.log(values)
      // console.log('chats')
      // console.log(unsorted)
      const newUnsorted = unsorted.map((item, index) => {
        //
        const createdAt = values[index].createdAt;
  
        return {
          ...item,
          createdAt,
        };
      });
  
      // console.log('unsorted')
      // console.log(newUnsorted)
      const sorted = newUnsorted
        .sort(
          (chat1, chat2) =>
            new Date(chat1.createdAt).getTime() -
            new Date(chat2.createdAt).getTime()
        )
        .reverse();
  
      const undefinedMap = new Map(
        [...lastMessages.current].filter((e) => !e[1])
      );
  
      const undefinedkeys = Array.from(undefinedMap.keys());
  
      const undefinedChats = allChats
        .map((chat, index) => {
          // console.log('each chat',chat)
          // console.log("oh my god", undefinedkeys[index])
          if (undefinedkeys.includes(chat._id)) return chat;
        })
        .filter((item) => item);
  
      newChats.current = [...sorted, ...undefinedChats];
  
      console.log("final chats");
      console.log(newChats.current);
    }
  }

  handleUpdate()




  useEffect(() => {
    console.log("howdy howdy howdy howdy howdy howdy howdy howdy howdy howdy");
    if (receivedMessage) {
      const toCheck = receivedMessage.isPrivate
        ? receivedMessage.from
        : receivedMessage.to;
      console.log("to check");
      console.log(toCheck);
      console.log(newChats.current);
      const item = newChats.current.find((item) => toCheck === item._id);
      console.log("selected item");
      console.log(item);
      newChats.current = newChats.current.filter(
        (chat) => chat._id !== item._id
      );
        if(item){
          lastMessages.current.set(item._id, receivedMessage);
        }
      
    }

    setIsUpdated({...isUpdated})
   

  }, [receivedMessage]);

  useEffect(() => {
    

    if (messageToSend) {
      const item = newChats.current.find(
        (item) => messageToSend.to === item._id
      );

      newChats.current = newChats.current.filter(
        (chat) => chat._id !== item._id
      );
      lastMessages.current.set(item._id, messageToSend);
      // setUpdatedItem({item,messageToSend})
    }
  }, [messageToSend]);

  
  
 

  return (
    <div className="flex flex-col bg-[#e8eeef] w-1/3 p-4 h-full gap-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">{tabSelected}</h2>

        {tabSelected==="Groups" && <HiOutlinePlus id="plus" className="cursor-pointer" onClick={(e)=>{
          e.stopPropagation()
          setIsHiddden(false)
         }} />}
        <ReactTooltip
        anchorId="plus"
        place="bottom"
        variant="info"
        content="create new group"
      />
      </div>
      {!isHiddden && <CreateGroup setIsHiddden={setIsHiddden} groups={groups} setGroups={setGroups} />}
       
      <div className="flex bg-[#f5fcff] h-10 rounded-2xl p-4 items-center gap-x-4 ">
        <FiSearch />
        <input
          className="w-full bg-[#f5fcff] px-1 focus:outline-none"
          type="text"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
          placeholder="Search user"
        />
      </div>
      

      <h2 className="font-medium">Recent</h2>
      <div className="flex flex-col gap-y-4 overflow-clip hover:overflow-y-auto  scrollbar-track-slate-300  scrollbar-thin scrollbar-thumb-[#61605e]">
        {mcount < allChats.length
          ? allChats.map((item, index) => (
              <Chat
                setmCount={setmCount}
                receivedMessage={receivedMessage}
                counts={counts}
                lastMessages={lastMessages}
                chatSelected={chatSelected}
                key={item._id}
                messageToSend={messageToSend}
                item={item}
                setChatSelected={setChatSelected}
                setChats={setChats}
                tabSelected={tabSelected}
              />
            ))
          : newChats.current.map((item, index) => (
              <Chat
                setmCount={setmCount}
                counts={counts}
                lastMessages={lastMessages}
                chatSelected={chatSelected}
                key={item._id}
                messageToSend={messageToSend}
                item={item}
                setChatSelected={setChatSelected}
                setChats={setChats}
                tabSelected={tabSelected}
              />
            ))}
      </div>
    </div>
  );
};

export default Chats;
