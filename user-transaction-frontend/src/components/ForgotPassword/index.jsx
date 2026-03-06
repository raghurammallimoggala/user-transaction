import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";
function ForgotPassword(){
    const [email, setEmail ]= useState("");
    const [newPassword, setNewPassword]= useState("");
    const [message, setMessage]= useState("");
    const [isSuccess, setIsSuccess ]=useState(false);
    const [showNewPassword, setShowNewPassword]=useState(false);
    const [loading,setLoading]=useState(false);
    const validateEmail=(email)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword=(password)=>/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

    const navigate=useNavigate();
    const toggleNewPassword= ()=>{
        setShowNewPassword(!showNewPassword);
    };
    const handleSubmit=async (e)=>{
        e.preventDefault();

        if(!validateEmail(email)){
            setMessage("Enter valid email address");
            setIsSuccess(false);
            return ;
        }

        if(!validatePassword(newPassword)){
            setMessage("Password must contain uppercase, lowercase and number (min 6 chars");
            setIsSuccess(false);
            return;
        }
        setMessage("");
        setLoading(true);

        try{
            const response=await fetch("http://localhost:3000/forgot-password",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({email, newPassword}),
            });
            const data=await response.json()
            if(response.ok){
                setMessage("Password chnaged successfylly");
                setEmail("");
                setNewPassword("");
                setIsSuccess(true);

                setTimeout(()=>{
                    navigate("/login");
                }, 2000);
            }else{
                setMessage(data.error||"Failed to forgot password");
                setIsSuccess(false);
            }

        }catch(e){
            setMessage("server error");
            setIsSuccess(false);
        }finally{
            setLoading(false);
        }

    }
    return(
    <div className="min-h-screen flex items-center justify-center bg-gray-100 m-10">
       <form className="bg-white p-6 rounded-lg shadow-md h-96 w-96" onSubmit={handleSubmit}>
            <h1 className="text-xl font-bold mb-4 text-center">Forgot Password</h1>
            <div>
                <label className="text-xl font-semibold" htmlFor="email">Email:</label>
                <div className="relative">
                <input
                type="text"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={e=>{setEmail(e.target.value);setMessage("");}}
                className="w-full border p-2 mb-3 rounded" required/>
                </div>
            </div>
            <div>
                <label className="text-xl font-semibold" htmlFor="newPassword">NewPassword:</label>
                <div className="relative">
                <input
                type={showNewPassword ? "text":"password"}
                id="newPassword"
                placeholder="Enter NewPassword"
                value={newPassword}
                onChange={e=>{setNewPassword(e.target.value); setMessage("");}}
                className="w-full border p-2 mb-3 rounded" required/>
                <span className="absolute right-3 top-3 cursor-pointer" onClick={toggleNewPassword}>{showNewPassword ? <FaEyeSlash/> : <FaEye/>}</span>
                </div>
            </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">{loading ? "Updating...":"Update Password"}</button>
        <button onClick={()=>navigate("/dashboard")} className="mt-4 text-blue-500 hover:underline block text-center w-full"> Back Dashboard</button>
        {message &&(<p className={`mt-3 text-center ${isSuccess ? "text-green-700" : "text-red-700"} `}>{message}</p>)}
       </form>
    </div>

    )
}
export default ForgotPassword;