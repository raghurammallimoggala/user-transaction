import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
function UserTransactions(){
    const [transactions, setTransactions]=useState([]);
    const [title, setTitle]=useState("");
    const [amount, setAmount]=useState("");
    const [category, setCategory]=useState("");
    const [date, setDate]=useState("");
    const [message, setMessage]=useState(""); 
    const [isSuccess, setIsSuccess]=useState(false)
    const [editId, setEditId]=useState(null); 
    const [loading, setLoading]=useState(false);
    const [search, setSearch]=useState(""); 
    

    const navigate=useNavigate();

    const API_URL="http://localhost:3000/transactions"

    const fetchTransactions= async()=>{ 
        try{
            setLoading(true);
        const token=localStorage.getItem("jwtToken");
        const response=await fetch(API_URL,{
           headers:{
            Authorization:`Bearer ${token}`,
           },
        });

        if(response.status === 401){
            localStorage.removeItem("jwtToken");
            navigate("/login");
            return;

        }

        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        const data= await response.json();
        if(response.ok){
            setTransactions(data);
        }else{
            setMessage("Failed to fetch transactions");
            setIsSuccess(false);
        }
        }catch(error){
            setMessage("Server error");
            setIsSuccess(false);
        }finally{
            setLoading(false);
        }
    }; 

    useEffect(()=>{
        fetchTransactions();
    },[]);


    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        setMessage("");
    try{
        const token=localStorage.getItem("jwtToken");

        const url=editId ? `${API_URL}/${editId}`:
                            API_URL;
        const method=editId ? "PUT" : "POST"; 

        const response=await fetch(url,{
            method,
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`,
            },
            body:JSON.stringify({
                title,
                amount:Number(amount),
                category,
                date,
            }),
        });

        if(response.status === 401){
            localStorage.removeItem("jwtToken");
            navigate("/login");
            return;

        }

            const data= await response.json()
            if(response.ok){
                setMessage(editId ? "Transaction Update Successfully":"Transaction Added successfully");
                setTitle("");
                setAmount("");
                setCategory("");
                setDate("");
                setIsSuccess(true);
                setEditId(null);
                fetchTransactions();
            }else{
                setMessage(data.message||"Failed to add transaction");
                setIsSuccess(false);
            }
    }catch(error){
        setMessage("Server error");
        setIsSuccess(false);
    }finally{
        setLoading(false);
    }
    };

    const handleEdit=(item)=>{
        setTitle(item.title);
        setAmount(String(item.amount));
        setCategory(item.category);
        setDate(item.date);
        setEditId(item.id);
    };

    const handleDelete=async(id)=>{
        try{
            const token =localStorage.getItem("jwtToken");
            const response=await fetch(`${API_URL}/${id}`,{
                method:"DELETE",
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            });

            if(response.status === 401){
            localStorage.removeItem("jwtToken");
            navigate("/login");
            return;

        }

            if(response.ok){
                setMessage("Transaction Deleted Successfully");
                setIsSuccess(true)
                fetchTransactions();
            }else{
                setMessage("Failed to delete transactions");
            }
            
        }catch(error){
            setMessage("Server error");
            setIsSuccess(false);
        }
    };

    return(
        <div className="grid md:grid-cols-2 gap-8">
            <div className=" bg-gray-100 p-6 rounded shadow-md">
                <h1 className="text-xl font-bold mb-4 text-center">{editId ? "Edit Transaction" : "Add Transaction"}</h1>
                <form className="" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="block text-gray-700">Title:</label>
                    <input type="text" id="title" placeholder="Enter Title" value={title} className="w-full border p-2 mb-3 rounded"
                    onChange={e=>{setTitle(e.target.value);setMessage("");}} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="amount" className="block text-gray-700">Amount:</label>
                    <input type="number" id="amount" placeholder="Enter amount" value={amount} className="w-full border p-2 mb-3 rounded"
                    onChange={e=>{setAmount(e.target.value.replace(/\D/, ""));setMessage("");}} required/>
                </div>

                <div className="mb-3">
                    <label htmlFor="category" className="block text-gray-700">Category:</label>
                    <select className="w-full border p-2 mb-3 rounded" id="category" value={category} onChange={e=>{setCategory(e.target.value);setMessage("");}} required>
                        <option value="">Select Category</option>
                        <option value="Income">Income</option>
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Bills">Bills</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="date" className="block text-gray-700">Date:</label>
                    <input type="date" id="date" placeholder="Enter date" value={date} className="w-full border p-2 mb-3 rounded"
                    onChange={e=>setDate(e.target.value)} required/>
                </div>
                 <button type="submit" disabled={loading} className="bg-blue-500 text-white w-full p-2 rounded">{editId ? "Updating...":"Adding..."}</button>
                </form>
                 {message && (<p className={`m-3 ${isSuccess ? "text-green-500":"text-red-500"}`}>{message}</p>)}
            </div>
            <div className="mt-6">
                <input type="search"
                    value={search}
                    onChange={e=>setSearch(e.target.value)}
                    placeholder="Search"
                    className="w-full border p-2 mb-4 rounded"/>
                <div className="h-[500px] overflow-y-auto pr-2">
                {loading ? (<p>Loading...</p>): transactions.length === 0 ? (<p>No Transactions found</p>) : (
                    transactions.filter((item)=>item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.category.toLowerCase().includes(search.toLowerCase())).map((item)=>(
                <div key={item.id} className="bg-gray-100 p-3 mb-3 rounded shadow flex-col justify-center items-center">
                    <div>
                        <p className="font-bold">Title: {item.title}</p>
                        <p className="font-bold">Amount: ₹{item.amount}</p>
                        <p className="font-bold">Category: {item.category}</p>
                        <p className="font-bold">Date: {new Date(item.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                    <button className="bg-cyan-300 text-white px-2 py-1 rounded" onClick={()=>handleEdit(item)}>Edit</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded ml-5" onClick={()=>handleDelete(item.id)}>Delete</button>
                    </div>
                    </div>
                )
            ))}
               </div> 
            </div>
        </div>
    );

}
export default UserTransactions;