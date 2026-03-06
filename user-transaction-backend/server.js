require("dotenv").config();

if (!process.env.MY_SECRET_KEY) {
    console.error("ERROR: JWT secret key (MY_SECRET_KEY) is missing in .env!");
    process.exit(1); // Stop server until secret is defined
}
const express =require("express");
const cors= require("cors");
const path= require("path");
const bcrypt= require("bcrypt");
const {open}= require("sqlite");
const sqlite3 = require("sqlite3");
const jwt =require("jsonwebtoken");

const app= express();
app.use(cors());
app.use(express.json());

const dbPath=path.join(__dirname, "userTransaction.db");
let db=null; 

const initializeDbAndServer= async()=>{
    try{

        db= await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        const PORT = process.env.PORT || 3000;
        app.listen(PORT,()=>{
            console.log(`Server is running at http://localhost:${PORT}`);
        })
    }catch(e){
        console.log(`Db Error:${e.message}`);
        process.exit(1);
    }
}
initializeDbAndServer(); 

const validatePassword=(password)=>{
    return password.length >=6;
}

//API/ register user // 

app.post("/register", async (request, response)=>{
    const {username,email,password,gender, location }= request.body;
    if(!validatePassword(password)){
        response.status(400);
        response.send("Password is too short");
        return;
    }
    const selectUserQuery=`
    SELECT * FROM user WHERE username=? OR email=?;`;
    const dbUser= await db.get(selectUserQuery, [username, email]);
    if (dbUser === undefined){
        const hashedPassword = await bcrypt.hash(password, 10);
        const createUserQurey=`
        INSERT INTO user (username, password, email, gender, location) VALUES (?, ?, ?, ?, ?);`
        const dbResponse= await db.run(createUserQurey, [username, hashedPassword, email, gender, location]);
        const userId= dbResponse.lastID;
        return response.status(200).json({
            message:"User created successfully",
            userId:userId,
        });
    }else{
        return response.status(400).json({message:"User already exists"});
    }
});

//API/ login user // 

app.post ("/login", async (request, response)=>{
    const {email, password}=request.body;
    const selectUserQuery=`
    SELECT * FROM user WHERE email=?;`;
    const dbUser= await db.get(selectUserQuery, [email]);
    if(dbUser === undefined){
        return response.status(400).json(({message:"Invalid email"}));
    }else{
        const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
        if(isPasswordMatched){
            const payload ={username:dbUser.username, userId:dbUser.id};
            const jwtToken= jwt.sign (payload,process.env.MY_SECRET_KEY,{expiresIn: "1h"} );
            return response.status(200).json({jwtToken:jwtToken, message:"login successful"});
        }else{
            return response.status(400).json(({message:"Invalid password"}));
        }
    }
});


//API/MIDDLEWARE/ authentication// 

const authenticateToken=(request, response, next)=>{
    let jwtToken;
    const authHeader= request.headers["authorization"];
    if (authHeader !== undefined){
        jwtToken = authHeader.split(" ")[1];
    }
    if(jwtToken === undefined){
       return response.status(401).json({
        message:"Token Missing"
       });
       
    }
        jwt.verify(jwtToken,process.env.MY_SECRET_KEY,async (error, payload)=>{
            if(error){
                if(error.name === "TokenExpiredError"){
                    return response.status(401).json({
                        message:"Token Expired"
                    });
                }

                return response.status(403).json({
                      message:"Invalid Jwt Token"  
                    });
            }
                request.userId= payload.userId;
                request.username= payload.username;
                next();

        });
    }

// API/forgot password//

app.post("/forgot-password", async (request, response)=>{
    const {email, newPassword}= request.body;
    const selectUserQuery=`
    SELECT * FROM user WHERE email=?;`;
    const dbUser= await db.get(selectUserQuery, [email]);
          if(!dbUser){
            return response.status(404).json({message:"Email not found"});
          }

          if(newPassword.length < 6){
            return response.status(400).json({message:"Password too short"});
          }
        
        const hashedNewPassword= await bcrypt.hash(newPassword, 10);
        const updatePasswordQuery=`
        UPDATE user SET password=? WHERE email=?;`;
        await db.run(updatePasswordQuery, [hashedNewPassword, email]);
        response.status(200).json({message:"Password reset successfully"});
        
});


// API/ user-transactions// 

app.post ("/transactions",authenticateToken,async (request, response)=>{
    const {title, amount, category, date, notes}= request.body;
    const userId = request.userId;
    const createTransactionQuery=`
    INSERT INTO transactions (user_id, title, amount, category, date, notes) VALUES(?,?,?,?,?,?);`;
    const dbResponse=await db.run(createTransactionQuery,[userId,title, amount, category, date, notes]);
    const transactionId= dbResponse.lastID;
    response.status(200).json({message:`Transaction created successfully with id:${transactionId}`});

});

// API/get user transactions//

app.get("/transactions", authenticateToken, async (request, response)=>{
    const userId = request.userId;
    const{search="", category="", minAmount="", maxAmount="", from="", to=""}= request.query;
    let query=`
    SELECT * FROM  transactions WHERE user_id= ?`;
    
    let params=[userId];
    if(search !== ""){
        query += ` AND title LIKE ?`;
        params.push("%" + search + "%");
    }
    if(category !== ""){
        query += ` AND category LIKE ?`;
        params.push("%" + category + "%");
    }
    if(minAmount !== ""){
        query += ` AND amount >= ?`;
        params.push(minAmount);
    }
    if(maxAmount !== ""){
        query += ` AND amount <= ?`;
        params.push(maxAmount);
    }
    if(from !== ""){
        query += ` AND date >= ?`;
        params.push(from);
    }
    if(to !== ""){
        query += ` AND date <= ?`;
        params.push(to);
    }
    query += " ORDER BY date DESC;";
    const transactions= await db.all(query, params);
    response.status(200).json(transactions);}); 

// API/update user transactions//

app.put("/transactions/:id", authenticateToken, async (request, response)=>{
    const {id}= request.params;
    const {title,amount,category, date, notes}= request.body;
    const userId= request.userId;
    const updateTransactionsQuery=`
    UPDATE transactions SET title=?, amount=?, category=?, date=?, notes=? WHERE id=? AND user_id=?;`;
    const result=await db.run (updateTransactionsQuery,[title, amount, category, date, notes, id, userId]);
    if(result.changes === 0){
        return response.status(404).json({
            message:("Transaction not found  or not authorized")
        });
    }
    response.status(200).json({message:`transactions with id:${id} updated successfully`});
});

// API/delete user transactions//

app.delete("/transactions/:id", authenticateToken, async (request, response)=>{
    const {id}= request.params;
    const userId= request.userId;
    const deleteTransactionQuery=`
    DELETE FROM transactions WHERE id=? AND user_id=?;`;
    const result=await db.run(deleteTransactionQuery, [id, userId]);
    if(result.changes === 0){
        return response.status(404).json({
            message:("Transaction not found  or not authorized")
        });
    }
    response.status(200).json({message:`transactions with id:${id} deleted successfully`}); 

}); 

module.exports= app;