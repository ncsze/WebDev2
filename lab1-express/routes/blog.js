const express = require("express");
const router = express.Router();

const data = require("../data");
const blog = data.blog;

/*
MIDDLEWARE
    You will apply a middleware that will be applied to the POST, PUT and PATCH
    routes for the /blog endpoint that will check if there is a logged in user,
    if there is not a user logged in, you will respond with the proper status code.
    For PUT and PATCH routes you also need to make sure the currently logged in 
    user is the user who posted the blog post that is being updated.
*/
/* 
if (!req.session.user){
        return res.status(401).json({message: "Unauthorized."});
    }
*/

router.post('/blog', (req, res, next) =>{
    if (!req.session.user){
        return res.status(401).json({message:"No login."});
    }
    next();
});

router.put('/blog/:id', async (req, res, next) =>{
    if (!req.session.user){
        return res.status(401).json({message:"No login."});
    }
    // Post ownership check.
    let post;
    try {
        post = await blog.getPost(req.params.id);
    } catch (error) {
        return res.status(400).json({message:"Bad ID."});
    }
    if (post.userThatPosted.username !== req.session.user.username){
        return res.status(401).json({message:"Logged in user is not original poster."});
    }

    next();
});

router.patch('/blog/:id', async (req, res, next) =>{
    if (!req.session.user){
        return res.status(401).json({message:"No login."});
    }
    // Post ownership check.
    let post;
    try {
        post = await blog.getPost(req.params.id);
    } catch (error) {
        return res.status(400).json({message:"Bad ID."});
    }
    if (post.userThatPosted.username !== req.session.user.username){
        return res.status(401).json({message:"Logged in user is not original poster."});
    }

    next();
});


/*
GET 	/blog 	
    Shows a list of blog posts in the system. By default, it will show the
    first 20 blog posts in the collection. If a querystring variable ?skip=n 
    is provided, you will skip the first n blog posts. If a querystring variable 
    ?take=y is provided, it will show y number of blog posts. By default, the 
    route will show up to 20 blog posts; at most, it will show 100 blog posts.
*/

router.get('/blog', async (req,res) =>{
    try {
        let skip = parseInt(req.query.skip);
        let take = parseInt(req.query.take);
        if (skip && (typeof(skip) !== 'number' || skip < 0)){
            throw 'skip must be a non-negative number.';
        }
        if (take && (typeof(take) !== 'number' || take < 0 || take > 100)){
            throw 'take must be a number in the range of [0,100].';
        }
        if (!take){
            take = 20;
        }
        let posts = await blog.getPosts(skip, take);
        res.status(200).json(posts);
        
    } catch (error) {
        res.status(400).json({message: error.toString()});
    }
});

/*
GET 	/blog/:id 	
    Shows the blog post with the supplied ID
*/

router.get('/blog/:id', async (req,res) =>{
    try {
        let id = req.params.id;
        let post = await blog.getPost(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({message: error.toString()});
    }
});

/*
POST 	/blog 	
    Creates a blog post with the supplied detail and returns created object; 
    fails request if not all details supplied.  The user MUST be logged in 
    to post a blog.  In the request body, you will only be sending the title 
    and the body fields of the blog post.  The userThatPosted will be 
    populated from the currently logged in user (when they login, you will 
    save a representation of the user in the session). You will initialize 
    comments as an empty array in your DB create function as there cannot be 
    any comments on a blog post, before the blog post has been created. 
*/

router.post('/blog', async (req,res) =>{
    try {
        let title = req.body.title;
        let body = req.body.body;

        if (!title || !body){
            throw 'title or body missing.';
        }
        if (typeof(title) !== 'string' || title.trim() === ""){
            throw 'title must be a non-empty string.';
        }
        if (typeof(body) !== 'string' || body.trim() === ""){
            throw 'body must be a non-empty string.';
        }

        let posted = await blog.addPost(title, body, req.session.user);

        res.status(200).json({message: "Post successful."});
    } catch (error) {
        res.status(400).json({message: error.toString()});
    }
});

/*
PUT 	/blog/:id 	
    Updates the blog post with the supplied ID and returns the updated blog 
    post object; Note: PUT calls must provide all details of the new state of 
    the object! Note:  you cannot manipulate comments in this route! A user 
    has to be logged in to update a blog post AND they must be the same user 
    who originally posted the blog post.  So if user A posts a blog post, user 
    B should NOT be able to update that blog post. In the request body, you 
    will only be sending the title and the body fields of the blog post. 
*/

router.put('/blog/:id', async (req,res) =>{
    try {
        let id = req.params.id;
        let title = req.body.title;
        let body = req.body.body;
        if (!title || !body){
            throw 'title or body missing.';
        }
        if (typeof(title) !== 'string' || title.trim() === ""){
            throw 'title must be a non-empty string.';
        }
        if (typeof(body) !== 'string' || body.trim() === ""){
            throw 'body must be a non-empty string.';
        }

        let put = await blog.updatePost(id, title, body);
        res.status(200).json({message: "Update successful."});
    } catch (error) {
        res.status(400).json({message: error.toString()});
    }
});

/*
PATCH 	/blog/:id 	
    Updates the blog post with the supplied ID and returns the updated blog 
    post object; Note: PATCH calls only provide deltas of the value to update! 
    Note: you cannot manipulate comments in this route! A user has to be logged 
    in to update a blog post AND they must be the same user who originally 
    posted the blog post.  So if user A posts a blog post, user B should NOT be 
    able to update that blog post. In the request body, you will only be sending 
    the title and the body fields of the blog post. 
*/

router.patch('/blog/:id', async (req,res) =>{
    try {
        let id = req.params.id;
        let title = req.body.title;
        let body = req.body.body;
        if (title && (typeof(title) !== 'string' || title.trim() === "")){
            throw 'title must be a non-empty string.';
        }
        if (body && (typeof(body) !== 'string' || body.trim() === "")){
            throw 'body must be a non-empty string.';
        }

        let put = await blog.updatePost(id, title, body);
        res.status(200).json({message: "Update successful."});
    } catch (error) {
        res.status(400).json({message: error.toString()});
    }
});


module.exports = router;