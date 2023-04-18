import { useState ,useContext} from 'react';
import { loginFields, signupFields } from "../constants/formFields"
import FormAction from "./FormAction";
import Input from "./Input";
import axios from "axios";
import { userContext } from '../App';
import { useNavigate } from 'react-router';

const fields=loginFields;
let fieldsState={};

fields.forEach(field => fieldsState[field.id]='');

export default function Signup(){
  const navigate=useNavigate()
  const [signupState,setSignupState]=useState(fieldsState);
  const {user,setUser}=useContext(userContext)

  const handleChange=(e)=>setSignupState({...signupState,[e.target.id]:e.target.value});

  const handleSubmit=(e)=>{
    e.preventDefault();
    console.log(signupState)
    createAccount()
  }

  //handle Signup API Integration here
  const createAccount=async()=>{
    try {
      console.log('before sending')
      console.log(signupState.username,signupState.password)
      const response = await axios.post('http://localhost:3001/register',{
        username:signupState.username,
        password:signupState.password
      })

      
      sessionStorage.setItem('currentUser',JSON.stringify(response.data))
      setUser(response.data)
      navigate('/chat')
      
    } catch (error) {
      console.log(error)
      
    }



  }

    return(
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="">
        {
                fields.map(field=>
                        <Input
                            key={field.id}
                            handleChange={handleChange}
                            value={signupState[field.id]}
                            labelText={field.labelText}
                            labelFor={field.labelFor}
                            id={field.id}
                            name={field.name}
                            type={field.type}
                            isRequired={field.isRequired}
                            placeholder={field.placeholder}
                    />
                
                )
            }
          <FormAction handleSubmit={handleSubmit} text="Signup" />
        </div>

         

      </form>
    )
}