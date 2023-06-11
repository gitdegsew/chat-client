import { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const MyDropButton = ({ handleLeaveGroup }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div>
      {open ? (
        <FaAngleUp className="cursor-pointer" onClick={handleOpen} />
      ) : (
        <FaAngleDown className="cursor-pointer" onClick={handleOpen} />
      )}
      {open ? (
        <div className="absolute rounded-lg bg-opacity-70  top-5 right-5 flex flex-col justify-around items-center  bg-[#6897bb]  mt-6 w-40 h-16 p-4">
          <span
            className="text-[#ff3232] cursor-pointer font-Roboto text-xl hover:text-[#d62d20] "
            onClick={() => {
              setOpen(false);
              handleLeaveGroup();
            }}
          >
            leave group
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default MyDropButton;
