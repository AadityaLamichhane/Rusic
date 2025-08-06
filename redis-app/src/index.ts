import {createClient, RedisClientType} from "redis"
import {WebSocketServer} from "ws"
import { getToken } from "next-auth/jwt"
const redisConfig = {
    host:process.env.REDIS_HOST|| 'localhost',
    port:parseInt(process.env.REDIS_PORT || "6739"),
    password:process.env.REDIS_PASSWORD,
    username:process.env.REDIS_USERNAME,
    database:parseInt(process.env.REDIS_DB ||"0")

}
let client :RedisClientType ; 
async function initializeRedis(){
    try{
        client = createClient({
            socket:{
                host:redisConfig.host,
                port:redisConfig.port,
            },
            password:redisConfig.password,
            username:redisConfig.username,
            database:redisConfig.database

        })
        client.on("connect",()=>{
            console.log('The client is Connectedt to the Redis Application');

        })

    await client.connect();
    }
    catch(err){
        console.log(err);
    }
}
 initializeRedis().then(()=>{
    ServerHandeling();
 });
 enum Socket_Sending_type{
    Create_Stream,
    Stream_Man,
    Next_Stream
 }
 type Socket_Sending= {
    type : Socket_Sending_type,
    url: String  ,
    userId: String ,  
 }
 async function verifyAuthentication(req:any){
      try {
    // Get the token using NextAuth's getToken function
    const token = await getToken({ 
      req, 
      secret: process.env.AUTH_SECRET,
      cookieName: process.env.NEXTAUTH_COOKIE_NAME || 'next-auth.session-token'
    });
    
    return token;
  }catch(err){
     console.error('Error verifying NextAuth session:', err);
     return null;
  }
    
 }
 function ServerHandeling(){
    const wss = new WebSocketServer({
        port:8080,
        verifyClient: async (info:any) => {
            try{
                const session = await verifyAuthentication(info.req);
                      if (!session) {
                    console.log('No valid NextAuth session found');
                    return false;
                }
                info.req.session = session;
                console.log(`User ${session.email} authenticated for WebSocket`);
                return true;
            }
            catch(err){
                console.log('bad-thing-happends')
            }
            
            
        } 
    });
    wss.on("connection",(socket)=>{
    socket.send("Hello this is my application");


    socket.on("messege",(messege)=>{
        // Messege can be only string so parsing to json
         const messegeJson:Socket_Sending  = JSON.parse(messege);
         switch(messegeJson.type){
            case Socket_Sending_type.Create_Stream:

         }


        
    })
    //  client.lPush("submission",JSON.stringify({problemid , code , language , userId })) 
});
 }
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await client.quit();
    process.exit(0);
});

