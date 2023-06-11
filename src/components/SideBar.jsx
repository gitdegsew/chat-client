import React, { useContext } from "react";
import src from "../assets/profile.jpg";
import { IoMdLogOut } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { AiOutlineSetting } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BsGlobe2, BsChatSquareTextFill } from "react-icons/bs";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useNavigate } from "react-router";
import { socket } from "../socket";
import { appContext } from "../App";

const SideBar = ({ setTabSelected, tabSelected }) => {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const { unseen } = useContext(appContext);
  const privUnseen = unseen.filter((un) => un.isPrivate);
  const groupUnseen = unseen.filter((un) => !un.isPrivate);

  const handleLogOut = () => {
    navigate("/", {
      replace: true,
    });
    socket.emit("logout", user.id);
    sessionStorage.removeItem("currentUser");
  };
  return (
    <div className="flex flex-col justify-around w-20 items-center h-full ">
      <div>
        <span className="flex flex-col justify-center w-12 h-12 rounded-full bg-[#007474] text-white  items-center">
          <p>{user.username[0].toUpperCase()}</p>
        </span>
        <span>{user.username}</span>
      </div>
      <div className="flex flex-col justify-between gap-y-8">
        <div className="relative">
          <BsChatSquareTextFill
            className={`w-8 h-8  ${
              tabSelected == "All chats" ? "text-[#00ccff]" : "text-[black]"
            } hover:cursor-pointer ${
              tabSelected !== "All chats" ? "hover:text-[#c3bfc6]" : null
            }`}
            onClick={(e) => {
              setTabSelected("All chats");
            }}
          />
          {unseen.length > 0 && (
            <div className="absolute -top-3 -right-2 w-5 h-5 flex justify-center items-center text-gray-50 text-xs rounded-full bg-red-400">
              {unseen.length}
            </div>
          )}
        </div>

        <div className="relative">
          <CgProfile
            className={`w-8 h-8  ${
              tabSelected == "Users" ? "text-[#00ccff]" : "text-[black]"
            } hover:cursor-pointer ${
              tabSelected !== "Users" ? "hover:text-[#c3bfc6]" : null
            }`}
            onClick={(e) => {
              setTabSelected("Users");
            }}
          />
          {privUnseen.length > 0 && (
            <div className="absolute -top-3 -right-2 w-5 h-5 flex justify-center items-center text-gray-50 text-xs rounded-full bg-red-400">
              {privUnseen.length}
            </div>
          )}
        </div>
        <div className="relative">
          <HiUserGroup
            className={`w-8 h-8  ${
              tabSelected == "Groups" ? "text-[#00ccff]" : "text-[black]"
            } hover:cursor-pointer ${
              tabSelected !== "Groups" ? "hover:text-[#c3bfc6]" : null
            }`}
            onClick={(e) => {
              setTabSelected("Groups");
            }}
          />
          {groupUnseen.length > 0 && (
            <div className="absolute -top-3 -right-2 w-5 h-5 flex justify-center items-center text-gray-50 text-xs rounded-full bg-red-400">
              {groupUnseen.length}
            </div>
          )}
        </div>

        <AiOutlineSetting className="w-8 h-8" />
      </div>
      <div className="flex flex-col justify-between gap-y-8">
        <BsGlobe2 className="w-8 h-8" />
        <IoMdLogOut
          onClick={handleLogOut}
          id="app-title"
          className="w-8 h-8 hover:cursor-pointer"
        />
      </div>
      <ReactTooltip
        anchorId="app-title"
        place="bottom"
        variant="info"
        content="log out"
      />
    </div>
  );
};

export default SideBar;
