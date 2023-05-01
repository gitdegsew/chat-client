import React, { useContext, useEffect, useState } from 'react'
import { postGroup } from '../utils/api'
import LoadingIcons from 'react-loading-icons'
import { appContext } from '../App'

const CreateGroup = ({setIsHiddden,groups,setGroups}) => {
    const [groupName,setGroupName] =useState('')
    const [isLoading,setIsLoading] = useState(false)
    const [error,setError] = useState(null)
    const [group,setGroup] =useState(null)
    const user =JSON.parse(sessionStorage.getItem('currentUser'))

    // const {
      
    //   setGroups,
      
    // }=useContext(appContext)

    useEffect(()=>{
        const lis=() =>{
            document.getElementById('createGroup').style.display='none'
           
        }
        document.addEventListener('click',lis)
    
        return ()=>{
            document.removeEventListener('click',lis)
        }
    },[])
    
    const handleCandcelGroup =()=>{
      setGroupName('')
      setIsHiddden(true)

    }

    function onlyLettersAndSpaces(str) {
      return /^[A-Za-z\s]*$/.test(str);
    }

    const handleCheck =(e)=>{
            
          if(groups.map(group =>group.groupName).includes(e.target.value)){
            setError(new Error('group name used'))
          }
          else if(!onlyLettersAndSpaces(e.target.value)){
            setError(new Error("Invalid group name"))

          }
          else{
            setError(null)
          }
    }

    const handelCreateGroup=async()=>{
      try {
        setIsLoading(true)
        const result= await postGroup(user.accessToken,groupName,user.id)
        setIsLoading(false)
        setGroup(result)
        setIsHiddden(true)
        setGroups([...groups,result])
        
      } catch (error) {
        setIsLoading(false)
        setError(error)
      }


    }
  return (
    <div id="createGroup" className="absolute top-[10%] left-[30%] rounded-xl z-50 w-[40%] h-56 bg-[#003327]  flex flex-col justify-around items-center" onClick={(e)=>e.stopPropagation()}  >

      {
        isLoading &&<LoadingIcons.SpinningCircles stroke="#21e7dd" />
      }

      

          { !isLoading && 
            <><h3 className='text-white font-Roboto text-3xl'>Enter group name</h3><div className="flex bg-[#f5fcff] h-10 rounded-2xl p-4 items-center gap-x-4 ">

        <input
          className="w-full  px-1 focus:outline-none"
          type="text"
          value={groupName}
          onChange={(e) => {

            setGroupName(e.target.value)
            handleCheck(e)
          } }


          placeholder="ente group name" />
      </div></>
}
     {error && <p className='text-[#e7212b]'>{error.message}</p>}
      <div className='flex justify-around items-center gap-8 font-slab text-lg  font-bold pb-5 '>
            <span className='text-[hsl(180,46%,92%)] cursor-pointer hover:text-[#5dd75d]' onClick={handleCandcelGroup} >cancel</span>
            <span className={`text-[hsl(180,46%,92%)]  ${!error && groupName?"cursor-pointer hover:text-[#8d686c]":"text-gray-300"} `} onClick={error?()=>{}:handelCreateGroup} >create</span>
        </div>
      </div>
  )
}

export default CreateGroup
