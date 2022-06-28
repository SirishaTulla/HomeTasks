const express = require("express");
const users  = require("./UserDetails/Users").users;
const JOI = require('joi');
const router = express.Router();
const createUser= (req,res) => {
    const newUser = req.body;
    const isValid = isValidUser(newUser);
    if(!isValid.error){
        const reqUserId = users.findIndex((user) => user.id === newUser.id)
    
        if(reqUserId != -1)
        {
            res.statusCode = 404;
            res.send({message:'user already exists'});
            
        }
        else{
            res.statusCode = 200;
            users.push(newUser);
            res.send(users)
           

        }
    }
    else{
        res.statusCode=400;
        res.send(`validation error found ${isValid.error.message} `);
    }
}
const updateUser= (req,res) => {
    const reqUserId = req.params.userId;
    const updatedUserDetails = req.body;
    const isValid = isValidUser(updatedUserDetails);
    if(!isValid.error){
        const position = users.findIndex((user) => user.id === reqUserId)
        if(position != -1) // user exists
        {
            res.statusCode = 200;
            users[position] = updatedUserDetails;
            res.send(users);
           
        }
        else{
            res.statusCode = 400;
            res.send({message:'update cannot be done as user does not exist '});

        }
     }
    else{
        res.statusCode=400;
        res.send(`validation error found ${isValid.error.message} `);
    }
    
}
const removeUser = (req,res)=>{
    const reqUserId = req.params.userId;
    const userToBeDeleted = users.find(user => (user.id === reqUserId && !user.isDeleted));

    if(userToBeDeleted != null){ // user exists
           userToBeDeleted.isDeleted = true;
           res.statusCode = 200;
          
           res.send({message:"sucessfully Deleted a User",userToBeDeleted});
    }
    else{
           res.statusCode = 400;              
           res.send({message:"Unable to locate the user to Delete.","users":users});
    }
};

const getUserById = (req,res) => {
    const reqUserId = req.params.userId;
    const reqUser = users.find(user=>(user.id === reqUserId ));

    if(reqUser !=null){ 
            res.statusCode = 200;
            res.send(reqUser);
            console.log(reqUser); 
    } 
    else {
               res.statusCode = 400;
               res.send({ message: " unable to get  user by id " });
    }
};



const getAutoSuggestUsers = (req,res)=>{
    const loginSubstring = req.params.loginSubstring;
    const limit = req.params.limit;
    if(users.length>=limit){
        const SortedUsers = users.sort((username1,username2) => username1.login.localeCompare(username2.login));
        const autoSuggestedUsers = (SortedUsers.filter(user => user.login.indexOf(loginSubstring) != -1)).slice(0,limit);
        res.statusCode = 200;
        res.send({message:"The Suggested Users",Users:autoSuggestedUsers});
       
    }
    else
    {
        res.statusCode = 400;
        res.send({message:"The Suggested Users",Users: autoSuggestedUsers});
    }
}
const forAnyOtherRequest = (req,res)=>{
    throw new Error(`The requested Resource is not available - ${req.originalUrl}`);
};
function isValidUser(users){
    const schema =JOI.object({
        id : JOI.string().required(),
        login : JOI.string().required(),
        password : JOI.string().alphanum().required(),
        age : JOI.number().min(5).max(100).required(),
        isDeleted : JOI.boolean().required(),
    });

    const validation = schema.validate(users);
    return validation;
}


router.use("/getUser/:userId",getUserById);
router.use("/createUser",createUser);
router.use("/updateUser/:userId",updateUser);
router.use("/deleteUser/:userId",removeUser);
router.use('/getAutoSuggestUsers/:loginSubstring/:limit',getAutoSuggestUsers);
router.use('/*',forAnyOtherRequest);



module.exports = {
    router :router,
};
