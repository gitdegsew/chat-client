import {Circles} from 'react-loading-icons'
import ClipLoader from "react-spinners/ClipLoader";
import { useState, CSSProperties } from "react";
export default function FormAction({
  handleSubmit,
  type = "Button",
  action = "submit",
  text,
  loading
}) {

  


  return (
    <>
      {type === "Button" ? (
        <div className='flex flex-col gap-4 items-center'>
          <button
            type={action}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent transition ease-in-out delay-100 text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
            onSubmit={handleSubmit}
          >
            { text}
          </button>
          <ClipLoader
       
        loading={loading}
        
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
