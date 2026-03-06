import {useState} from "react";
import { useNavigate } from "react-router-dom";
import {FaEyeSlash,FaEye} from "react-icons/fa";
function UserRegister(){
    const [username, setUsername] = useState("");
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const [confirmPassword, setConfirmPassword]= useState("");
    const [gender, setGender]= useState("");
    const [location, setLocation]= useState("");
    const [message, setMessage]= useState("");
    const [isSuccess, setIsSuccess]=useState(false);
    const [showPassword, setShowPassword]=useState(false)
    const [showConfirmPassword, setShowConfirmPassword]=useState(false)
    const [loading,setLoading]=useState(false);
    const navigate = useNavigate();
    const validateEmail=(email)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword=(password)=>/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

    const toggleShowPassword=()=>{
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword=()=>{
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleRegister = async (e)=>{
        e.preventDefault();

        if(!username || !email || !password || !confirmPassword || !gender || !location){
            setMessage("Please fill all required fields");
            setIsSuccess(false);
            return;
        }

        if(!validateEmail(email)){
            setMessage("Enter valid email address");
            setIsSuccess(false);
            return;
        }

        if(!validatePassword(password)){
            setMessage("Password must contain uppercase, lowercase and number (min 6 chars");
            setIsSuccess(false);
            return;
        }

        if(password !== confirmPassword){
            setMessage("Password do not match");
            setIsSuccess(false);
            return;
        }

        setLoading(true);

        const userDetails={
            username,
            email,
            password,
            gender,
            location,
        }

        try{
            const response= await fetch("http://localhost:3000/register",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(userDetails),
            })

            const data = await response.json();

            if(response.ok){
                setMessage("Registration successfully. Please login.");
                setIsSuccess(true);
                setEmail("");
                setGender("");
                setLocation("");
                setConfirmPassword("");
                setPassword("");
                setUsername("");
                setTimeout(()=>{
                    navigate("/login")
                }, 2000);
            }else{
                setMessage(data.message || "Registration failed. Please try again.");
                setIsSuccess(false)
            }
        }catch(error){
            setMessage("Server error. Please try again later.");
            setIsSuccess(false)
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className=" min-w-full min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">User Registration</h2>
            <form className="mt-6 space-y-4" onSubmit= {handleRegister}>
                <div>
                    <label htmlFor="username" className=" block font-medium mb-1">Username:</label>
                    <input 
                    type="text"
                    id="username"
                    placeholder="Enter User name" 
                    value={username}
                    onChange={e=>{setUsername(e.target.value);setMessage("");}}
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-blue-500" required/>
                </div>
                <div>
                    <label htmlFor="email" className="">Email:</label>
                    <input 
                    type="email"
                    placeholder="Enter email" 
                    id="email"
                    value={email}
                    onChange={e=>{setEmail(e.target.value);setMessage("");}}
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-blue-500" required/>
                </div>
                <div>
                    <label htmlFor="password" className=" block font-medium mb-1">Password:</label>
                    <div className="relative">
                    <input 
                    type={showPassword ? "text":"password"}
                    placeholder="Enter password" 
                    id="password"
                    value={password}
                    onChange={e=>{setPassword(e.target.value);setMessage("");}}
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-blue-500" required/>
                    <span className="absolute right-3 top-3 cursor-pointer" onClick={toggleShowPassword}>{showPassword ? <FaEyeSlash/> : <FaEye/>}</span>
                </div>
                </div>
                <div>
                    <label htmlFor="confirmPassword" className=" block font-medium mb-1">ConfirmPassword:</label>
                    <div className="relative">
                    <input 
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Enter confirm password" 
                    value={confirmPassword}
                    onChange={e=>{setConfirmPassword(e.target.value);setMessage("");}}
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-blue-500" required/>
                    <span className="absolute right-3 top-3 cursor-pointer" onClick={toggleShowConfirmPassword}>{showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}</span>  
                </div>
                </div>
                <div>
                    <label htmlFor="gender" className="block font-medium mb-1">Gender:</label>
                    <select id="gender" value={gender} onChange={e=>{setGender(e.target.value);setMessage("");}} className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-blue-500">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value ="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="location" className="block font-medium mb-1">Location:</label>
                    <input 
                    type="text"
                    id="location"
                    placeholder="Enter location" 
                    value={location}
                    onChange={e=>{setLocation(e.target.value);setMessage("");}}
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-blue-500"/>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200" >
                    {loading ? "Registering...":"Register"}
                </button>
            </form> 
            {message && (<p className={`text-center mt-4 font-medium ${isSuccess ? "text-green-500":"text-red-500"}`}>{message}</p>)}
            <p className="text-center mt-5 text-gray-600">Already have an account?{" "}<span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={()=> navigate("/login")}>Login</span></p>

            </div>
        </div>
    )
}

export default UserRegister;