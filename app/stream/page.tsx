"use client"
import {  useState } from "react"
import { ButtonComponent } from "../components/ButtonComponet";
export default   function Stream (){
    const [inpvalue , Setinpvalue] = useState();
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
                    // Call to the db for the upvote redis 
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