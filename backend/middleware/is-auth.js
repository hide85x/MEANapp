const jwt= require('jsonwebtoken');

module.exports= (req, res, next)=> {

    try {
        const token= req.headers.authorization.split(" ")[1];
        // console.log(req.headers.authorization.split(" ")[0])
         const decodedToken= jwt.verify(token, "supersecretsecret");
        // console.log("decoded token  " + decodedToken.userId)
        req.userData= {
            email: decodedToken.email,
            userId: decodedToken.userId
        }
        next();

    }
    catch(err){
        res.status(401).json({msg: "Youre Not Authorized!"})
    }
}