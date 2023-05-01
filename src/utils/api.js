import axios from "axios"

// const baseUrl = "http://192.168.0.163:3001"
const baseUrl = "http://localhost:3001"

const getUsers =async (token,id)=>{
    try {
        const response = await axios.get(`${baseUrl}/users`,{
            headers:{
                'Authorization': 'Bearer ' + token
            }
        })
        return response.data.filter(data => data._id!==id)
    } catch (error) {
       throw new Error(error.message)
    }

}

const getGroups = async (token) => {
    try {
        const response = await axios.get(`${baseUrl}/groups`,{
            headers:{
                'Authorization': 'Bearer ' + token
            }
        })
        return response.data
    } catch (error) {
        throw new Error(error.message)
    }

}
const postGroup = async (token,groupName,userId) => {
    try {
        const response = await axios.post(`${baseUrl}/groups`,{
            groupName,userId
        },{
            headers:{
                'Authorization': 'Bearer ' + token
            }
        })
        return response.data
    } catch (error) {
        throw new Error(error.message)
    }

}

const getMessages = async (token,from,to,priv) =>{
    try {
        const response = await axios.get(`${baseUrl}/messages/${from}/${to}/${priv}`,{
            headers:{
                'Authorization': 'Bearer ' + token
            }
        })
        return response.data
    } catch (error) {
        throw new Error(error.message)
    }
}

const postMessage = async ({token,from,to,message,messageType}) => {
    console.log('postMessage ',{from,to,message,messageType})
    try {
        const response = await axios.post(`${baseUrl}/messages`,{
            from,to,message,messageType
        }
        ,{
            headers:{
                'Authorization': 'Bearer ' + token
            }
        })
        return response.data
    } catch (error) {
        console.log('get groups', error)
    }

}
const postImage = async (token,formdata) => {
    console.log('postImage from api ',formdata)
    fetch(`${baseUrl}/messages`, {
                method: 'POST',
               
                body: formdata,
                           
            }).then(resp=>{
                return resp['status']
            }).then( data => {
                data===201?
                console.log('success'):
                console.log('failure')
            })

}

export {getGroups,getUsers,getMessages,postMessage,postImage,baseUrl,postGroup}

