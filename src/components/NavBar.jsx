import React, { useContext, useState, useEffect } from "react";
import src from "../assets/profile.jpg";
import { FiSearch } from "react-icons/fi";
import { MdCall, MdVideoCall } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useNavigate } from "react-router";
import { appContext } from "../App";
import { socket } from "../socket";
import { Dot } from "react-animated-dots";
import MyDropButton from "./MyDropButton";
import { pageContext } from "../pages/ChatPage";
import { leaveGroup } from "../utils/api";

const NavBar = ({ chatSelected }) => {
  const [localIsTyping, setLocalIsTyping] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const { onlineUsers, isTyping, beingTyped, typing } = useContext(appContext);

  const { groups, setGroups, setChatSelected } = useContext(pageContext);

  let isOnline;
  let name;
  if (chatSelected) {
    isOnline = onlineUsers.includes(chatSelected._id);
    name = chatSelected.username
      ? chatSelected.username
      : chatSelected.groupName;
  }

  useEffect(() => {
    if (isTyping && chatSelected && beingTyped.includes(chatSelected._id)) {
      setLocalIsTyping(true);
    } else {
      setLocalIsTyping(false);
    }
  }, [beingTyped, chatSelected]);

  const handleAudioClick = () =>
    navigate("/videoCall", {
      state: {
        isVideo: false,
        remoteUser: chatSelected,
      },
    });
  const handleVideoClick = () =>
    navigate("/videoCall", {
      state: {
        isVideo: true,
        remoteUser: chatSelected,
      },
    });

  const handleLeaveGroup = () => {
    setLeaveLoading(true);
    leaveGroup(user.accessToken, user.id, chatSelected._id).then(
      (returnedGroup) => {
        setLeaveLoading(false);
        const filteredGroups = groups.filter(
          (group) => group._id !== returnedGroup._id
        );
        setGroups(filteredGroups);
        setChatSelected(null);
        socket.emit("leave-group", {
          groupId: returnedGroup._id,
          userId: user.id,
          username: user.username,
          groupName: returnedGroup.groupName,
        });
      }
    );
  };

  return (
    <div className="flex justify-between items-center z-10">
      <div className="flex justify-center items-center p-3 gap-x-2">
        {chatSelected ? (
          <>
            <span className="flex flex-col justify-center w-12 h-12 rounded-full bg-slate-800 text-white  items-center">
              <p>{name[0].toUpperCase()}</p>
            </span>

            <h3 className="font-medium">
              {chatSelected.username
                ? chatSelected.username
                : chatSelected.groupName}
            </h3>
            {localIsTyping && chatSelected.username && (
              <h2 className="text-[#0b8d76] text-xs">
                (typing<Dot>.</Dot>
                <Dot>.</Dot>
                <Dot>.</Dot>)
              </h2>
            )}
            {localIsTyping &&
              chatSelected.groupName &&
              typing.get(chatSelected._id).map((item, index) => (
                <div key={index}>
                  <h2 className="text-[#0d0d0d] text-xs">{item}</h2>
                  <h2 className="text-[#0b8d76] text-xs">
                    typing<Dot>.</Dot>
                    <Dot>.</Dot>
                    <Dot>.</Dot>
                  </h2>
                </div>
              ))}
          </>
        ) : (
          <p>No chat selected</p>
        )}
      </div>

      <div className="flex justify-center gap-x-4 pr-6 ">
        <FiSearch />
        <MdCall
          className={`${
            chatSelected && chatSelected.username && isOnline
              ? "cursor-pointer"
              : "text-gray-400"
          }`}
          onClick={
            chatSelected && chatSelected.username && isOnline
              ? handleAudioClick
              : () => {}
          }
        />

        <MdVideoCall
          className={`${
            chatSelected && chatSelected.username && isOnline
              ? "cursor-pointer"
              : "text-gray-400"
          }`}
          onClick={
            chatSelected && chatSelected.username && isOnline
              ? handleVideoClick
              : () => {}
          }
        />
        {chatSelected &&
          groups.map((group) => group._id).includes(chatSelected._id) && (
            <MyDropButton handleLeaveGroup={handleLeaveGroup} />
          )}
      </div>
    </div>
  );
};

export default NavBar;
