"use client"
import {  useState , useEffect } from "react"
import { ButtonComponent } from "../components/ButtonComponet";
export default   function Stream (){
    const [messege , setMessege] = useState(['']);
    const [inpvalue , Setinpvalue] = useState();
    const [socket , SetSocket] = useState();
     useEffect(()=>{
        const ws = new WebSocket("ws://localhost:8080");
        //@ts-ignore
         SetSocket(ws);
         ws.onmessage = (msg)=>{
           setMessege((prevMessage)=>[...prevMessage, msg.data])
         }
         ws.onerror = ((err)=>{
           console.log("Error whiel getting data ",err);
         })
},[]);
    return( <>
    <div className="flex flex-col h-full w-full">
    <div className="flex w-screen h-screen justify-center items-center  ">
        <div>
            <div className="flex flex-col justify-center items-center font-medium ">
            Enter the Stream url 
            <br></br>
            <input  placeholder='Enter the url of the Link' className="border p-2  " type="text" onChange={(event:any)=>{
                console.log("You clicked to the button");
                Setinpvalue(event.target?.value);
            }
            } />
            </div>
            <div className="flex ">
                <ButtonComponent inpvalue={inpvalue || ""}
                >
                </ButtonComponent>
                <button className="flex justify-center items-center bg-blue-400 px-4 p-2 m-2 rounded-3xl text-white " onClick={async()=>{
                    //@ts-ignore
                    socket.send(JSON.stringify({
                        type: '',
                        url: 'youtube.com'
                    }))
                }}>
                    upvote 

                </button>
            </div>
        </div>
    </div>
        <div>
            
        </div>
        <div>

        </div>
    </div>
    </>)
} 