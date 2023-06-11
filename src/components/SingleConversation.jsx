import React, { useContext, useEffect, useState } from "react";
import src from "../assets/profile.jpg";
import { AiFillFile } from "react-icons/ai";
import { pageContext } from "../pages/ChatPage";
import { appContext } from "../App";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const SingleConversation = ({ chat, chatSelected, setChats }) => {
  const date = new Date(chat.createdAt);
  const hour = date.getHours() % 12;
  const htd = hour < 10 ? "0" + hour : hour;
  const mtd =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const identify = date.getHours() <= 12 ? "AM" : "PM";
  const now = new Date();
  const diff = date.getTime() - now.getTime() < 1000 ? "just now" : "not now";
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  let toCheck = chat.users ? chat.users[0] : chat.from;
  const isUser = toCheck === user.id;
  const { percentageT } = useContext(appContext);

  let name =
    chat.isPrivate && !isUser
      ? chatSelected.username
      : isUser
      ? user.username
      : chat.sender
      ? chat.sender
      : "text";

  if (!name) {
    name = "erorr";
  }
  return (
    <div
      className={`flex my-2 gap-3 ${
        isUser && chat.sender !== "ADMIN" ? "flex-row-reverse" : "flex-row"
      } ${
        chat.sender === "ADMIN" &&
        "flex justify-center items-center text-center "
      }`}
    >
      {name && chat.sender !== "ADMIN" && (
        <div
          className="flex flex-col justify-center w-12 h-12 rounded-full bg-slate-800
         text-white  items-center"
        >
          <p>{name[0].toUpperCase()}</p>
        </div>
      )}
      <div
        className={`'flex flex-col max-w-[350px] ${
          isUser
            ? "bg-[#b2c7bd] rounded-md text-[#131615]"
            : "bg-[#6a78d1] rounded-md text-white"
        } ${
          chat.sender === "ADMIN" && "bg-[rgb(240,248,255)] h-8 text-[#008080]"
        } p-2  justify-between gap-y-4'`}
      >
        {chat.messageType === "image" ? (
          <img className="w-[18vw] " src={chat.message} />
        ) : chat.messageType === "video" ? (
          <>
            <video className="w-[24vw]" controls>
              <source src={chat.message}></source>
            </video>
            <div>
              {chat.from === user.id &&
                percentageT > 0 &&
                percentageT < 100 && (
                  <div>
                    <CircularProgressbar
                      value={percentageT}
                      text={`${percentageT}%`}
                      className="w-8 h-8 "
                      styles={buildStyles({
                        textColor: "#42936c",
                        pathColor: "turquoise",
                        trailColor: "gold",
                      })}
                    />
                  </div>
                )}
            </div>
          </>
        ) : chat.messageType === "video-db" ? (
          <video className="w-[18vw]" controls>
            <source src={chat.message}></source>
          </video>
        ) : chat.messageType === "non-text" ? (
          <p>
            {<AiFillFile />} {chat.message}{" "}
            {chat.from === user.id && percentageT > 0 && percentageT < 100 && (
              <CircularProgressbar
                value={percentageT}
                text={`${percentageT}%`}
                styles={buildStyles({
                  textColor: "red",
                  pathColor: "turquoise",
                  trailColor: "gold",
                })}
                className="w-8 h-8"
              />
            )}
          </p>
        ) : chat.messageType === "image-blob" ? (
          <img className="w-[18vw]  " src={chat.message} />
        ) : (
          <p>
            {chat.sender === "ADMIN" &&
            chat.message.split(" ")[0] === user.username
              ? `You  ${chat.message.split(" ")[2]} the group`
              : chat.message}
          </p>
        )}
        {chat.sender !== "ADMIN" && (
          <p className="text-xs text-[#354a40]">{`${htd}:${mtd} ${identify}`}</p>
        )}
      </div>
    </div>
  );
};

export default SingleConversation;
