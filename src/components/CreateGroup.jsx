import React, { useContext, useEffect, useState } from 'react'
import { postGroup } from '../utils/api'
import LoadingIcons from 'react-loading-icons'
import { appContext } from '../App'
import { socket } from "../socket";
import { pageContext } from '../pages/ChatPage';

const CreateGroup = ({setIsHiddden,groups,setGroups}) => {
    const [groupName,setGroupName] =useState('')
    const [isLoading,setIsLoading] = useState(false)
    const [error,setError] = useState(null)
    const [group,setGroup] =useState(null)
    const user =JSON.parse(sessionStorage.getItem('currentUser'))

    // const {
      
    //   setGroups,
      
    // }=useContext(appContext)

    const {setChats,chats,setMessageToSend,setChatSelected} =useContext(pageContext)

    useEffect(()=>{
        const lis=() =>{
            setIsHiddden(true)
           
        }
        console.log('clic')
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
          else if(!onlyLettersAndSpaces(e.target.value) || e.target.value.length<2){
            setError(new Error("Invalid group name"))

          }
          else{
            setError(null)
          }
    }

    const handelCreateGroup=()=>{
        console.log('handleCreateGroup is called')

        // socket.emit('groupCreated',{})

        setIsLoading(true)
         postGroup(user.accessToken,groupName,user.id).then((result) =>{

          setIsLoading(false)
          setGroup(result)
          setIsHiddden(true)
          setGroups([...groups,result])
          const messageToSend = {
            message: `${user.username} has created the group`,
            from: user.id,
      
            to: result._id,
            messageType: "notification",
            isPrivate:  false,
            sender: "ADMIN",
            createdAt: new Date(),
          };
          
          setChatSelected(result)
          setChats([...chats,messageToSend])
          setMessageToSend(messageToSend)

          console.log("creating group has reached here...")
  
          socket.emit('groupCreated',{groupName,groupId:result._id,userId:user.id,username:user.username})

         }).catch(error =>{
          console.log("creating must be here...")
          console.log(error)
          setIsLoading(false)
          setError(error)
         })

       
        
        
      


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
