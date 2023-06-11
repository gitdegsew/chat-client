import React, { useContext, useEffect, useRef } from "react";
import SingleConversation from "./SingleConversation";
import ReactScrollableFeed from "react-scrollable-feed";
import { pageContext } from "../pages/ChatPage";

const Conversations = ({ chats, chatSelected }) => {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  const dates = [
    ...new Set(
      chats.map((chat) =>
        new Date(chat.createdAt).toString().split(" ").slice(0, 4).join(" ")
      )
    ),
  ];
  const dateMessages = dates.map((date) => {
    return {
      message: date,
      from: user.id,

      to: user.id,
      messageType: "notification",
      isPrivate: false,
      sender: "ADMIN",
      createdAt: new Date(date),
    };
  });

  const orderedChats = [...chats, ...dateMessages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  console.log("dates from conversation ");

  return (
    <div className="flex flex-col  p-6 gap-y-6 overflow-clip hover:overflow-y-auto scrollbar-track-slate-300  scrollbar-thin scrollbar-thumb-[#61605e]">
      {!chatSelected ? (
        <p className="text-center">select user or group and start chatting</p>
      ) : chats.length === 0 ? (
        <p className="text-center">
          start conversation with{" "}
          {chatSelected.username
            ? chatSelected.username
            : chatSelected.groupName}
        </p>
      ) : (
        <ReactScrollableFeed>
          {orderedChats.map((chat, index) => (
            <SingleConversation
              key={index}
              chat={chat}
              chatSelected={chatSelected}
            />
          ))}
        </ReactScrollableFeed>
      )}
    </div>
  );
};

export default Conversations;
