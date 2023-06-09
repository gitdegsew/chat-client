import { useEffect, useState } from "react";

function Timer({max}){
    const [then,setThen] =useState(new Date())
    const [now, setNow] = useState((new Date()));
    let timeDiffInSeconds=Math.floor((now.getTime()-then.getTime())/1000)
    let timePassedInSeconds=timeDiffInSeconds%60
    let timeDiffInMinutes =Math.floor(timeDiffInSeconds/60)
    let timeDiffInHours =Math.floor(timeDiffInSeconds/3600)
     
    let id
    useEffect(() =>{
        
           id=  setInterval(()=>{
                setNow(new Date())
            }, 1000);
        
        // return ()=>{
        //     clearInterval(id)
        // }
    
    },[now]);

    return(
        <div className="bg-[#2eb9b9] text-[#f29bc7] text-4xl p-3 rounded-2xl absolute top-10 right-10 z-50">
           {`${timeDiffInHours<10?`0`+timeDiffInHours:timeDiffInHours}:${timeDiffInMinutes<10?`0`+timeDiffInMinutes:timeDiffInMinutes}:${timePassedInSeconds<10?`0`+timePassedInSeconds:timePassedInSeconds}`}
        </div>
    )
}

export default Timer;