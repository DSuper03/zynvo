import getJwtToken from '../helpers/getJwtToken'
const cookieToken=(user,res)=>{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const token=getJwtToken(user.id);
    const options={
        expires:new Date(
            Date.now()+3*24*24*60*60*1000 // 3 days
        ),
        httpOnly:true
    }
    user.password=undefined;
    res.status(200).cookie('token',token,options).json({
        success:true,
        token,
        user
    })
    res.cookie('token', token, options);

}

export default cookieToken 