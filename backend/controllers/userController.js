
import prisma from "../prisma.js";

import cookieToken from "../utils/cookieToken.js";
import next from "next";
export default signup=async(req,res,next)=>{
    try{
        const {name,email,password}=req.body
        if(!name || !email || !password){
            throw new Error("Please provide all fields")
        }


        const user =await prisma .user.create({
            data:{
                name,
                email,
                password
            }
        })

        //sending the token

        cookieToken(user,res)
        
    }catch(error){

        res.status(500).json({ message: error.message });
    }

}
