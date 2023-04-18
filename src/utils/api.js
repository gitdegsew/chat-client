import axios from "axios"

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

// const getMessages = async (token,from,to) => {
//     try {
//         const response = await axios.get(`${baseUrl}/groups`,{
//             headers:{
//                 'Authorization': 'Bearer ' + token
//             }
//         })
//         return response.data
//     } catch (error) {
//         console.log('get groups', error)
//     }

// }

export {getGroups,getUsers,getMessages}

