import { useState, useContext } from "react";
import { loginFields, signupFields } from "../constants/formFields";
import FormAction from "./FormAction";
import Input from "./Input";
import axios from "axios";
import { baseUrl } from "../utils/api";
import { useNavigate } from "react-router";


const fields = loginFields;
let fieldsState = {};

fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Signup() {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  const [loading,setLoading] =useState(false)

  const navigate = useNavigate();
  const [signupState, setSignupState] = useState(fieldsState);

  const handleChange = (e) =>
    setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(signupState);
    createAccount();
  };

  const createAccount = async () => {
    try {
      console.log("before sending");
      console.log(signupState.username, signupState.password);
      setLoading(true)
      const response = await axios.post(`${baseUrl}/register`, {
        username: signupState.username,
        password: signupState.password,
      });

      setLoading(false)
      sessionStorage.setItem("currentUser", JSON.stringify(response.data));

      navigate("/chat");
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  };

  return (
    <form className="mt-8 space-y-6 w-1/2" onSubmit={handleSubmit}>
      <div className="">
        {fields.map((field) => (
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
        ))}
        <FormAction handleSubmit={handleSubmit} text="Signup" loading={loading} />
      </div>
    </form>
  );
}
