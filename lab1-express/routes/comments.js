const express = require("express");
const router = express.Router();

const data = require("../data");
const comments = data.comments;

/*
MIDDLEWARE
    You will apply a middleware that will be applied to the 
    POST and DELETE routes for the /blog/:id/comments and 
    /blog/:blogId/:commentId endpoints respectively that will 
    check if there is a logged in user, if there is not a user 
    logged in, you will respond with the proper status code. 
    For the DELETE route, you also need to make sure the 
    currently logged in user is the user who posted the 
    comment that is being deleted.
*/
router.post('/blog/:id/comments', (req, res, next) =>{
    if (!req.session.user){
        return res.status(401).json({message:"No login."});
    }
    next();
});

router.delete('/blog/:blogId/:commentId', async (req, res, next) =>{
    if (!req.session.user){
        return res.status(401).json({message:"No login."});
    }
    //Comment ownership check
    try {
        let comment = await comments.getComment(req.params.blogId, req.params.commentId);
        if (comment.userThatPostedComment.username !== req.session.user.username){
            return res.status(401).json({message:"Logged in user is not original commenter."});
        }
    } catch (error) {
        return res.status(400).json({message:error.toString()});
    }
    
    next();
});

/*
POST /blog/:id/comments 
    Adds a new comment to the blog post; ids must be generated
    by the server, and not supplied, a user needs to be logged
    in to post a comment
*/

router.post('/blog/:id/comments', async (req, res) =>{
    try {
        let comment = req.body.comment;
        if (!comment){
            throw 'Comment not supplied.';
        }
        if (typeof(comment) !== 'string' || comment.trim() === ""){
            throw 'Comment must be a non-empty string.';
        }

        let posted = await comments.addComment(req.params.id, comment, req.session.user);

        res.status(200).json({message: "Comment successfully posted."});

    } catch (error) {
        res.status(400).json({message: error.toString()});
    }
    
});

/*
DELETE 	/blog/:blogId/:commentId 	
    Deletes the comment with an id of commentId on the blog
    post with an id of blogId a user has to be logged in to
    delete a comment AND they must be the same user who
    originally posted the comment.  So if user A posts a
    comment, user B should NOT be able to delete that comment. 
*/
router.delete('/blog/:blogId/:commentId', async (req, res) =>{
    try {
        let deletion = await comments.deleteComment(req.params.blogId, req.params.commentId);
        res.status(200).json({message: "Comment successfully deleted."}); 
    } catch (error) {
        res.status(400).json({message: error.toString()});
    }





});

module.exports = router;