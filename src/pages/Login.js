import Header from "../components/Header"
import Login from "../components/Login"

export default function LoginPage(){
    return(
        <div className="flex flex-col items-center w-full text-center justify-center" >
             <Header
                heading="Login to your account"
                paragraph="Don't have an account yet? "
                linkName="Signup"
                linkUrl="/signup"
                />
            <Login/>
        </div>
    )
}