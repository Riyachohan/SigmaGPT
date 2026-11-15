import "./Sidebar.css";
import {useContext,useEffect} from 'react';
import {MyContext} from './MyContext.jsx';
import {v4 as uuidv4} from 'uuid';

function Sidebar(){
    const {allThreads,setAllThreads,currThreadId,setPrompt,setReply,setNewChat,setPrevChats,setCurrThreadId} = useContext(MyContext);

    const getAllThreads = async() => {
        try{
            let response = await fetch("http://localhost:8080/api/thread");
            let res = await response.json();
            let filteredData = res.map((thread)=> ({threadId:thread.threadId,title:thread.title}));
            // console.log(filteredData);
            setAllThreads(filteredData);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getAllThreads();
    },[currThreadId]);


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply("");
        setCurrThreadId(uuidv4());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try{
            let response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            // console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        }
        catch(err){
            console.log(err);
        }

    }

    const deleteThread = async (threadId) => {
        try{
            let response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method:"DELETE"});
            let res = await response.json();
            console.log(res);

            //update all thread state after deletion or re-render
            setAllThreads((prev) => prev.filter((thread)=> thread.threadId !== threadId));

            if(threadId === currThreadId){
                createNewChat();
            }
        }
        catch(err){
            console.log(err);
        }
    }
    
    return(
       <section className="sidebar">
           {/* new chat button */}
           <button onClick={createNewChat}>
            <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
            <span><i className="fa-solid fa-pen-to-square"></i></span>
           </button>

           {/* history */}
           <ul className="history">
              {
                allThreads?.map((thread,idx)=>(
                  <li key={idx} onClick={() => changeThread(thread.threadId)}
                    className={thread.threadId == currThreadId? "highlighted":" "}
                  >
                    {thread.title}

                    <i className="fa-solid fa-trash" 
                       onClick = {(e) => {
                         e.stopPropagation();  //stop event bubbling 
                         deleteThread(thread.threadId);
                       }}
                    ></i>
                  </li>
                ))
              }
            {/* <li>Thread 1</li>
            <li>Thread 2</li>
            <li>Thread 3</li> */}
           </ul>

           {/* sign */}
           <div className="sign">
             <p>By Riya Chouhan &hearts;</p>
           </div>
       </section>
    )
}

export default Sidebar;

