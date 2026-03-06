import {useEffect} from "react";
import {useNavigate} from  "react-router-dom";
import UserTransactions from "../UserTransactions"
function Dashboard() {
    const navigate= useNavigate();

    useEffect(()=>{
        const token= localStorage.getItem("jwtToken");
        if(!token){
            navigate("/login"); 
            return;   
        }
      
       },[navigate])
   
        const handleLogout=()=>{
            localStorage.removeItem("jwtToken");
            navigate("/login");
        }

    return (
        <div className="min-h-screen bg-sky-300 p-6">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6">
            <div className=" flex justify-between items-center mb-6 ">
            <h1 className="text-3xl font-semibold text-black mt-3 ml-5 ">Dashboard</h1>
            <button onClick={handleLogout} className="bg-cyan-400 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 mr-5 mt-5">
                Logout
            </button>
            </div>
            <div><UserTransactions/></div>
        </div>
        </div>
    )
}

export default Dashboard;                