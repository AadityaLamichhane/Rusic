"use client"
import axios from "axios";
import { useSession } from "next-auth/react"; 
export const ButtonComponent = ({inpvalue}:{inpvalue:string})=>{
const  Sessiondata= useSession();
    return <>
        <button className="bg-blue-400 p-2 m-2 text-white rounded-3xl px-4" onClick={async ()=>{
            const reqData = {
                url : inpvalue,
                email:Sessiondata.data?.user?.email
            }
            const config = {
                headers: {
                  'Content-Type': 'application/json',
                },
            withCredentials:true , 
            };              
            const data = await axios.post(`/api/stream`,reqData
                ,config);
                console.log(data.data.msg);

        }}>Stream</button>
    </>

}