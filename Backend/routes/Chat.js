import express from "express";
const router = express.Router();
import Thread from "../models/Thread.js";
import getGeminiResponse from "../utils/gemini.js";

//test
router.post("/test",async(req,res)=>{
    try{
        const thread = new Thread({
            threadId:"abc",
            title:"Testing New Thread3"
        });

        const response = await thread.save();
        res.send(response);

    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message});
    }
});

router.get('/thread',async(req,res)=>{
    try{
        const threads = await Thread.find({}).sort({updatedAt:-1});
        //descending order of updatedAt...most recent data at top
        res.json(threads)
    }
    catch(error){
        console.log(error)
        res.status(500).json({error:"Failed to fetch threads"});
    }
})

router.get('/thread/:threadId',async(req,res)=>{
    const {threadId} = req.params;
    try{
        const thread = await Thread.findOne({threadId});

        if(!thread){
            res.status(404).json({error:"Thread not found"});
        }

        res.json(thread.messages);
    }
    catch(error){
        console.log(error)
        res.status(500).json({error:"Failed to fetch chat"})
    }
})


router.delete('/thread/:threadId',async(req,res)=>{
    const {threadId} = req.params;

    try{
        const delThread = await Thread.findOneAndDelete({threadId});

        if(!delThread){
            res.status(404).json({error:"Thread not found"});
        }

        res.status(200).json({success:"Chat successfully deleted"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"Failed to delete thread"})
    }
})

router.post('/chat',async(req,res)=>{
    let {threadId,message} = req.body;

    if(!threadId || !message){
        return res.status(404).json({error:"missing required fields"});
    }

    try{
        let thread = await Thread.findOne({threadId});

        if(!thread){
                thread = new Thread({
                threadId,
                title:message,
                messages:[{role:'user',content:message}]

            })
        }else{
            thread.messages.push({role:'user',content:message});
        }

        const assistantReply = await getGeminiResponse(message);

        thread.messages.push({role:"assistant",content:assistantReply});
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply:assistantReply});

    }
    catch(error){
        console.log(error);
        res.status(500).json("something went wrong");
    }
});

export default router;