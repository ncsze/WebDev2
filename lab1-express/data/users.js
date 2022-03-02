const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

module.exports = {
    async createUser(name, username, password){
        if (!name || !username || !password){
            throw "Not all details supplied.";
        }
        if(typeof(name) !== 'string' || name === ""){
            throw "name must be a non-empty string.";
        }
        if (typeof(username) !== 'string' || username === ""){
            throw "username must be a non-empty string.";
        }
        if (typeof(password) !== 'string' || password === ""){
            throw "password must be a non-empty string.";
        }

        const saltRounds = 2;
        const hashed_password = await bcrypt.hash(password, saltRounds);
        
        const userCollection = await users();

        //Check for existing user.
        const usernameTaken = await userCollection.findOne( {username: username} );
        if (usernameTaken !== null){
            throw new Error("Username is already taken.");
        }

        let newUser = {
            name: name,
            username: username,
            hashed_password: hashed_password
        };
        const insertion = await userCollection.insertOne(newUser);
        if (insertion.insertedCount === 0){
            throw new Error("createUser: Could not add user.");
        }
        newUser._id = insertion.insertedId;
        return newUser;
    },
    async login(username, password){
        if (!username || !password){
            throw 'username or password not supplied.';
        }
        if (typeof(username)!=='string' || username.trim() === ""){
            throw 'username must be a non-empty string.';
        }
        if (typeof(password)!== 'string' || password.trim() === ""){
            throw 'password must be a non-empty string.';
        }

        const userCollection = await users();
        const userInDB = await userCollection.findOne( {username: username} );
        if (userInDB === null) throw 'Login failed. Invalid username/password.';

        if (await bcrypt.compare(password, userInDB.hashed_password)){
            // If username found in DB and password matches, return login info.
            return userInDB;
        }else{
            // Else, throw error.
            throw 'Login failed. Invalid username/password.';
        }



    }
};