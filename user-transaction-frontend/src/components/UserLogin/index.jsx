import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {FaEyeSlash,FaEye} from "react-icons/fa";
function UserLogin(){
    const [email, setEmail]= useState("");
    const [password, setPassword]=useState("");
    const [message, setMessage]= useState("");
    const [showPassword, setShowPassword]=useState(false);
    const [isSuccess, setIsSuccess]=useState(false)
    const [loading, setLoading]=useState(false);

    const navigate= useNavigate();

    const toggleShowPassword=()=>{ 
        setShowPassword(!showPassword)
    };
    const validateEmail=(email)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleLogin= async (e)=>{
        e.preventDefault();

        if(!email || !password){
            setMessage("Please enter both email and password");
            setIsSuccess(false);
            return;
        }
        
        if(!validateEmail(email)){
            setMessage("Enter valid email address");
            setIsSuccess(false);
            return ;
        }
        setLoading(true);
        setMessage("");

        const credentials={
            email,
            password,
        }

        try{
            const response= await fetch("http://localhost:3000/login",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(credentials),
            })
            const data= await response.json();

            
            if(response.ok){
                localStorage.setItem("jwtToken", data.jwtToken);
                setMessage("Login successfully");
                setEmail("");
                setPassword("");
                setIsSuccess(true);
                setTimeout(()=>{
                    navigate("/dashboard");
                }, 1000);
            }else{
                setMessage(data.message || "Login failed. Please try again.");
                setIsSuccess(false)
            }
        }catch(error){
            setMessage("Server error. Please try again later.");
            setIsSuccess(false)
        }finally{
            setLoading(false)
        }
    };

    return(
        <div className=" min-w-full min-h-screen flex items-center justify-center bg-gray-100 px-4 ">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">User Login</h2>
                <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="block font-medium mb-1">Email:</label>
                        <input 
                        type="email"
                        id="email"
                        placeholder="Enter email"
                        value={email} 
                        onChange={e=>{setEmail(e.target.value);setMessage("");}}
                        autoComplete="email"
                        className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block font-medium mb-1">Password:</label>
                        <div className="relative">
                        <input 
                        type={showPassword ? "text":"password"}
                        id="password"
                        placeholder="Enter password" 
                        value={password}
                        onChange={e=>{setPassword(e.target.value);setMessage("");}}
                        autoComplete="current-password"
                        className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-blue-500"/>
                        <span className="absolute right-3 top-3 cursor-pointer" onClick={toggleShowPassword}>{showPassword ? <FaEyeSlash/> : <FaEye/>}</span>
                    </div>
                    </div>
                    <p className="text-slate-700 font-semibold text-right" onClick={()=>navigate("/forgot-password")}>Forgot Password</p>
                    <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
                        {loading ? "Logging in.." : "Login"}
                    </button>
                    <button type="button" className="text-center font-semibold" onClick={()=>navigate("/register")}>You Register</button>
                </form>
                {message && <p className={`mt-4 text-center ${isSuccess ? "text-green-500":"text-red-500"}`}>{message}</p>}
            </div>
        </div>

    )
}
export default UserLogin;