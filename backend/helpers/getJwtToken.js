import jsonwebtoken from "jsonwebtoken";
const jwt=jsonwebtoken
const getJwtToken=(userId)=>{
    return jwt.sign({userId:userId}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports=getJwtToken