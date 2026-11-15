import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import {MyContext} from './MyContext.jsx';
import {useContext,useState,useEffect} from 'react';
import { ScaleLoader } from "react-spinners";


function ChatWindow(){

    const [loading, setLoading] = useState(false);
    
    const {prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, prevChats, setPrevChats,setNewChat} = useContext(MyContext);
    const [isOpen, setIsOpen] = useState(false);

    let getReply = async() =>{
        console.log("clicked");
        setLoading(true);
        setNewChat(false);
        const options = {
            method:"POST",

            headers:{
                "content-type":"application/json",
            },

            body:JSON.stringify({
                message:prompt,
                threadId:currThreadId
            })
        };

        try{
            let response = await fetch("http://localhost:8080/api/chat",options);
            let res = await response.json();
            console.log(res);
            setReply(res.reply);
        }catch(e){
            console.log(e);
        }
        setLoading(false);
    }

    useEffect(()=>{
        if(prompt && reply){
            setPrevChats((prev)=>
              [...prev,{
                  role:"user",
                  content:prompt,
              },{
                role:"assistant",
                content:reply,
              }]
            )
        }
        setPrompt("");
        
    },[reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }


    return(
        <div className="chatWindow">

            <div className="navbar">
                <span>SigmaGPT<i className="fa-solid fa-angle-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {isOpen &&
                <div className="dropdown">
                    <div className="dropdownItem"><i class="fa-solid fa-gear"></i>Settings</div>
                    <div className="dropdownItem"><i class="fa-solid fa-cloud-arrow-up"></i>Upgrade plan</div>
                    <div className="dropdownItem"><i class="fa-solid fa-arrow-right-from-bracket"></i>Log out</div>
                </div>
            }


            <Chat></Chat>
            {/* <ScaleLoader color="#fff" loader={loading}></ScaleLoader> */}
            {loading && <ScaleLoader color="#fff"></ScaleLoader>}


            <div className="chatInput">
                <div className="inputBox">

                    <input type="text" placeholder="Ask anything" 
                      value={prompt} 
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key == 'Enter'? getReply() : ' '}>
                    </input>

                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>

                <p className="info">
                    SigmaGPT can make mistakes.Check important info.See Cookie Preferences.
                </p>
            </div>

        </div>
    )
}

export default ChatWindow;
