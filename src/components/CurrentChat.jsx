import React, { useContext, useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import Conversations from "./Conversations";
import TextField from "./TextField";
import { socket } from "../socket";
import { pageContext } from "../pages/ChatPage";
import { joinGroup } from "../utils/api";

const CurrentChat = ({ chatSelected }) => {
  const [joinLoading, setJoinLoading] = useState(false);
  let isMember = useRef(true).current;
  const { groups, setGroups, setChats, chats, setMessageToSend } =
    useContext(pageContext);
  const groupIds = groups.map((group) => group._id);
  const user = JSON.parse(sessionStorage.getItem("currentUser"));

  useEffect(() => {
    if (
      chatSelected &&
      chatSelected.groupName &&
      !groupIds.includes(chatSelected._id)
    ) {
      isMember = false;
    }
  }, [groups, chatSelected]);

  const handleJoinGroup = () => {
    setJoinLoading(true);
    joinGroup(user.accessToken, user.id, chatSelected._id).then((group) => {
      setJoinLoading(false);
      setGroups([...groups, group]);
      const messageToSend = {
        message: `${user.username} has joind the group`,
        from: user.id,

        to: group._id,
        messageType: "notification",
        isPrivate: false,
        sender: "ADMIN",
        createdAt: new Date(),
      };
      setChats([...chats, messageToSend]);
      setMessageToSend(messageToSend);
      socket.emit("join-group", {
        groupId: group._id,
        userId: user.id,
        username: user.username,
        groupName: group.groupName,
      });
    });
  };
  return (
    <div className="h-full flex flex-col justify-between w-2/3 px-3 relative">
      <div>
        <NavBar chatSelected={chatSelected} />
        <hr className="" />
      </div>

      {chatSelected && (
        <Conversations chats={chats} chatSelected={chatSelected} />
      )}
      <div>
        <hr />

        {chatSelected &&
        !(!chatSelected.username && !groupIds.includes(chatSelected._id)) ? (
          <TextField
            chatSelected={chatSelected}
            chats={chats}
            setChats={setChats}
            setMessageToSend={setMessageToSend}
          />
        ) : (
          chatSelected && (
            <div
              className=" text-white  w-full h-10 mb-4 text-xl flex justify-center items-center bg-[#00432a] rounded-sm cursor-pointer hover:bg-[#16573f]"
              onClick={handleJoinGroup}
            >
              Join Group
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CurrentChat;
