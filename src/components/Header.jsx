import { Link } from "react-router-dom";
import image from "../assets/chat-icon-golden.png";

export default function Header({
  heading,
  paragraph,
  linkName,
  linkUrl = "#",
}) {
  return (
    <div className="mb-10">
      <div className="flex justify-center">
        <img alt="" className="h-10 w-25 md:h-20 md:w-35" src={image} />
      </div>
      <h2 className="mt-6 text-center font-bold text-2xl md:text-3xl md:font-extrabold text-amber-600">
        {heading}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600 ">
        {paragraph}{" "}
        <Link
          to={linkUrl}
          className="font-medium text-purple-600 hover:text-purple-500"
        >
          {linkName}
        </Link>
      </p>
    </div>
  );
}
