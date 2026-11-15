import express from "express";
import 'dotenv/config';
import cors from 'cors';
import mongoose from "mongoose";
import chatRoutes from "./routes/Chat.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.use("/api",chatRoutes)

app.listen(port, ()=> {
    console.log("server is listening");
    connectDB();
})

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("connected to database");
    }
    catch(error){
        console.log(error);
    }
}


// app.post('/test',async(req,res)=>{
//     const options = {
//         method:"POST",
//         headers:{
//             "content-type":"application/json",
//             "x-goog-api-key": process.env.GEMINI_API_KEY
//         },

//         body:JSON.stringify({
//             "model":"gemini-3.6-flash",
//             "input":[{
//                 "type":"user_input",
//                 // "content":"Hello! How are you?"
//                 "content": req.body.input
//             }]
//         })
//     }


//     try{

//        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions",options);
//        const data = await response.json();
//        // console.log(data.steps[1].content[0].text);
//        res.json(data.steps[1].content[0].text);

//     }
//     catch (error) {
//         console.log(error);
//     }
// })