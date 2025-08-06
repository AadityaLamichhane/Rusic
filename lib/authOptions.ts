import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/db"
export const authOptions = {

 secret: process.env.AUTH_SECRET,
    providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID??'',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET??""
  })
] ,

callbacks:{
  
  async signIn({profile, user , account}:any){
    try{
      if(account?.provider==="google"){
        const userinformation = await prisma.user.findFirst(
        {
          where:{
            email:profile?.email!
          }
        }
        ).catch((err)=>console.log(err));

        if(!userinformation){
          const data = await prisma.user.create({
            data:{
              provider:'Google',
              email:profile.email
            }
          })
        }
      return true;
      }
    
    }catch(err){
      throw new Error ("Unable to Signing the user ");
     
    }
    // update the value of the user ??

    
   return true; 
  }
}


}