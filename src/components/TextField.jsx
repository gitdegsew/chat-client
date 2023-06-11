import React, { useContext, useEffect, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { MdSend } from "react-icons/md";
import { socket } from "../socket";
import { ImAttachment } from "react-icons/im";
import { postMessage, postImage } from "../utils/api";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { baseUrl } from "../utils/api";
import { appContext } from "../App";

const TextField = ({ chatSelected, setChats, chats, setMessageToSend }) => {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const openEmojis = () => {
    setOpen((prev) => !prev);
  };

  const { setPercentage, percentageT } = useContext(appContext);

  const typingText = (e) => {
    let random = e.target.value;
    if (random.trim().length === 0) {
      socket.emit("finished", {
        from: { id: user.id, username: user.username },
        to: chatSelected._id,
        isPrivate: chatSelected.username ? true : false,
      });
    } else if (random.trim().length === 1) {
      socket.emit("istyping", {
        from: { id: user.id, username: user.username },
        to: chatSelected._id,
        isPrivate: chatSelected.username ? true : false,
      });
    }
  };

  const selectedEmoji = (e) => {
    let elm = document.getElementById("message");

    elm.value = elm.value + e.native;
    setText(elm.value);
  };

  const shareFile = (metadata, buffer) => {
    socket.emit("file-meta", metadata);

    socket.on("fs-start", ({ from, to, isPrivate, percentage }) => {
      let chunk = buffer.slice(0, metadata.buffer_size);
      buffer = buffer.slice(metadata.buffer_size, buffer.length);
      if (chunk.length !== 0) {
        console.log("ok", percentage);
        if (percentageT < percentage) {
          setPercentage(percentage);
        }

        socket.emit("file-raw", {
          buffer: chunk,
          from: to,
          to: metadata.to,
          isPrivate: metadata.isPrivate,
        });
      }
    });
  };

  const sendFile = async (e) => {
    const files = e.target.files[0];
    console.log("sendFile", files);
    const from = user.id;
    const to = chatSelected._id;
    const message = files.name;
    e.target.value = null;

    if (
      files.type.includes("image") === false &&
      files.type.includes("video") === false
    ) {
      const messageToSend = {
        from: user.id,
        to: chatSelected._id,
        message: files.name,
        sender: user.username,
        messageType: "non-text",
        isPrivate: chatSelected.username ? true : false,
        createdAt: new Date(),
      };

      setMessageToSend(messageToSend);
      setChats([...chats, messageToSend]);
      const token = user.accessToken;
      const result = await postMessage({ ...messageToSend, token });
      console.log("post message :", result);
    }

    if (files) {
      const reader = new FileReader();

      if (files.type.includes("image") !== false) {
        const blobdata = URL.createObjectURL(files);

        const messsageToSend = {
          from: user.id,
          to: chatSelected._id,
          message: blobdata,
          messageType: "image",
          isPrivate: chatSelected.username ? true : false,
          createdAt: new Date(),
        };
        setMessageToSend(messsageToSend);
        setChats([...chats, messsageToSend]);

        const formdata = new FormData();
        formdata.append("imageMessage", files, files.name);
        formdata.append("message", files.name);
        formdata.append("from", user.id);
        formdata.append("sender", user.username);
        formdata.append("to", chatSelected._id);
        formdata.append("messageType", "image-blob");
        formdata.append("isPrivate", chatSelected.username ? true : false);
        formdata.append("createdAt", new Date());

        console.log("from text field", formdata);
        const token = user.accessToken;

        fetch(`${baseUrl}/messages/image`, {
          method: "POST",

          body: formdata,
          headers: {
            Authorization: "Bearer " + token,
          },
        })
          .then((resp) => {
            return resp["status"];
          })
          .then((data) => {
            data === 201 ? console.log("success") : console.log("failure");
          });
      }

      if (files.type.includes("video") !== false) {
        const blobdata = URL.createObjectURL(files);

        const messsageToSend = {
          from: user.id,
          to: chatSelected._id,
          message: blobdata,
          messageType: "video",
          isPrivate: chatSelected.username ? true : false,
          createdAt: new Date(),
        };
        setMessageToSend(messsageToSend);
        setChats([...chats, messsageToSend]);

        const formdata = new FormData();
        formdata.append("imageMessage", files, files.name);
        formdata.append("message", files.name);
        formdata.append("from", user.id);
        formdata.append("sender", user.username);
        formdata.append("to", chatSelected._id);
        formdata.append("messageType", "video-db");
        formdata.append("isPrivate", chatSelected.username ? true : false);
        formdata.append("createdAt", new Date());

        console.log("from text field", formdata);
        const token = user.accessToken;

        fetch(`${baseUrl}/messages/image`, {
          method: "POST",

          body: formdata,
          headers: {
            Authorization: "Bearer " + token,
          },
        })
          .then((resp) => {
            return resp["status"];
          })
          .then((data) => {
            data === 201 ? console.log("success") : console.log("failure");
          });
      }

      reader.onload = () => {
        let buffer = new Uint8Array(reader.result);
        shareFile(
          {
            message: files.name,
            from: user.id,
            sender: user.username,
            to: chatSelected._id,
            filetype: files.type,
            filename: files.name,
            max_buffer_size: buffer.length,
            buffer_size: 1024,
            isPrivate: chatSelected.username ? true : false,
            createdAt: new Date(),
          },
          buffer
        );
      };
      reader.readAsArrayBuffer(files);
      e.preventDefault();
    }
    e.preventDefault();
  };

  const handleSend = async () => {
    console.log("handle send is called");
    socket.emit("finished", {
      from: { id: user.id, username: user.username },
      to: chatSelected._id,
      isPrivate: chatSelected.username ? true : false,
    });

    const messageToSend = {
      message: text,
      from: user.id,

      to: chatSelected._id,
      messageType: "text",
      isPrivate: chatSelected.username ? true : false,
      sender: user.username,
      createdAt: new Date(),
    };
    setText("");
    setChats([...chats, messageToSend]);
    setMessageToSend(messageToSend);

    socket.emit("send-msg", messageToSend);
  };

  return (
    <div className="flex z-10 w-11/12 py-3 justify-between gap-x-6">
      <input type="file" className="hidden" id="file" onChange={sendFile} />

      <label htmlFor="file">
        <ImAttachment className="h-8 w-8" />
      </label>
      <div className="flex bg-[#d9dfe1] rounded-md  h-10 w-full  p-4 items-center gap-x-4 ">
        <input
          className=" bg-[#d9dfe1] px-1 w-full focus:outline-none"
          type="text"
          value={text}
          id="message"
          onChange={(e) => {
            typingText(e);
            setText(e.target.value);
          }}
          placeholder="Type text here..."
          onKeyDown={(e) => {
            e.key === "Enter" && handleSend();
          }}
        />
        <BsEmojiSmile
          onClick={() => {
            openEmojis();
          }}
        />
      </div>
      {open && (
        <div className="absolute bottom-20 right-10">
          {<Picker data={data} onEmojiSelect={selectedEmoji} theme={"light"} />}
        </div>
      )}
      <button
        className={`flex justify-center ${
          text ? "hover:cursor-pointer" : ""
        } items-center rounded-sm bg-[#416269] w-20`}
        disabled={!text}
        onClick={handleSend}
      >
        <MdSend className={`text-white w-8 h-8   `} />
      </button>
    </div>
  );
};

export default TextField;
