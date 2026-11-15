import "./Chat.css";
import {useContext,useState,useEffect} from 'react';
import {MyContext} from './MyContext.jsx';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
// import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';

//FORMATTING
//react-markdown
//rehype-highlight

function Chat(){
    const {newChat, prevChats, reply} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    //Adding typing effect for latest reply 
    useEffect(()=>{
        if(reply === null) {   //non typing effect => prevChats reload
            setLatestReply(null);
            return;
        }

        if(!prevChats?.length) return;

        const content = reply.split(" ");
        let idx = 0;
        const interval = setInterval(()=>{
            setLatestReply(content.slice(0,idx+1).join(" "));
            idx++;
            if(idx>=content.length){
                clearInterval(interval);
            }
        },40);

        return () => clearInterval(interval);

    },[reply,prevChats]);

    return(

        <>
            {newChat && <h1>Start with new chat!</h1>}
             
            <div className="chats">
                {prevChats?.map((chat,idx)=>{
                   if(chat.role === "assistant" && idx === prevChats.length-1){
                      return null;
                   }

                   return (<div className={chat.role === "user"? "userChat" : "gptChat"} key={idx}>
                      {
                        chat.role === "user"?
                        <p className="userMessage">{chat.content}</p>:
                        <Markdown rehypePlugins={rehypeHighlight}>{chat.content}</Markdown>
                      }
                   </div>);
                })}

                {
                    prevChats.length>0 && latestReply !== null &&
                    <div className="gptChat" key={"typing"}>
                        <Markdown rehypePlugins={rehypeHighlight}>{latestReply}</Markdown>
                    </div>
                }

                {
                    prevChats.length>0 && latestReply == null &&
                    <div className="gptChat" key={"non-typing"}>
                        <Markdown rehypePlugins={rehypeHighlight}>{prevChats[prevChats.length - 1].content}</Markdown>
                    </div>
                }
            </div>

            {/* <div className="chats">
                <div className="userChat">
                    <p className="userMessage">User Message</p>
                </div> 
                <div className="gptChat">
                    <p className="gptMessage">GPT Generated Message</p>
                </div>
            </div> */}
        </>
    )
}

export default Chat;