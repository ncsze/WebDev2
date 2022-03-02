const data = require("../data");
const users = data.users;

const express = require("express");
const router = express.Router();
/*
POST /blog/signup 
    Creates a new user in the system with the supplied detail and returns 
    the created user document (sans password); fails request if not all 
    details supplied.
*/
router.post('/blog/signup', async (req, res) => {
    try {
        let name = req.body.name;
        let username = req.body.username;
        let password = req.body.password;
        if (!name || !username || !password){
            throw "Not all details supplied.";
        }
        if(typeof(name) !== 'string' || name.trim() === ""){
            throw "name must be a non-empty string.";
        }
        if (typeof(username) !== 'string' || username.trim() === ""){
            throw "username must be a non-empty string.";
        }
        if (typeof(password) !== 'string' || password.trim() === ""){
            throw "password must be a non-empty string.";
        }

        let createNew = await users.createUser(name, username, password);
        res.status(200).json({
            _id: createNew._id, 
            name: createNew.name, 
            username: createNew.username
        });

    } catch (error) {
        res.status(400).json({message:error.toString()});
    }
});
/*
POST /blog/login
    Logs in a user with the supplied username and password. Returns the logged
    in user document (sans password). You will set the session so once they
    successfully log in, they will remain logged in until the session expires
    or they logout. You will store someway to identify the user in the session.
    You will store their username and their _id which will be read when they try
    to create a blog post, try to update a blog post (making sure they can only
    update a post they originally posted),  post a comment or delete a comment
    (making sure they can only delete a comment they posted)
*/
router.post('/blog/login', async (req, res)=>{
    try {
        let username = req.body.username;
        let password = req.body.password;
        if (!username || !password){
            throw 'username or password not supplied.';
        }
        if (typeof(username)!=='string' || username.trim() === ""){
            throw 'username must be a non-empty string.';
        }
        if (typeof(password)!== 'string' || password.trim() === ""){
            throw 'password must be a non-empty string.';
        }

        // Data call.
        const login = await users.login(username,password);

        // Create session.
        req.session.user = {username: login.username, _id: login._id};

        res.status(200).json({
            _id: login._id, 
            name: login.name, 
            username: login.username
        }); 
    } catch (error) {
        res.status(400).json({message: error.toString()});
    }
});

/*
GET /blog/logout 
    This route will expire/delete the cookie/session and inform the user that 
    they have been logged out.
*/
router.get('/blog/logout', async (req, res) => {
    if (req.session.user){
        req.session.destroy();
        res.status(200).json({message:"Logged out successfully."});
    }else{
        res.status(400).json({message:"Log out failed: No session to log out of."});
    }
});
module.exports = router;