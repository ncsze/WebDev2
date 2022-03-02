const mongoCollections = require('../config/mongoCollections');
const blog = mongoCollections.blog;
let { ObjectId } = require('mongodb');

module.exports = {
    async getComment(blogId, commentId){
        // Find the post.
        const blogCollection = await blog();
        let post = await blogCollection.findOne({_id: ObjectId(blogId)});
        if (post === null){
            throw 'Bad blog ID.';
        }
        let postComments = post.comments;
        let index = -1;
        for (let i = 0; i < postComments.length; i++){
            if (postComments[i]._id.equals( ObjectId(commentId) ) ){
                index = i;
                break;
            }
        }
        if (index === -1){
            throw 'Bad comment ID.';
        }
        //Remove comment.
        let found = postComments[index];
        return found;
    },
    async addComment(blogId, comment, user){
        if (!comment){
            throw 'Comment not supplied.';
        }
        if (typeof(comment) !== 'string' || comment.trim() === ""){
            throw 'Comment must be a non-empty string.';
        }

        let userThatPostedComment = {
            _id: user._id,
            username: user.username
        };
        // Find the post.
        const blogCollection = await blog();
        let post = await blogCollection.findOne({_id: ObjectId(blogId)});
        if (post === null){
            throw 'Bad ID.';
        }

        let newComment = {
            _id: new ObjectId(),
            comment: comment,
            userThatPostedComment: userThatPostedComment
        };

        let newComments = post.comments;
        newComments.push(newComment);

        //Update the post.
        const postUpdate = await blogCollection.updateOne(
            {_id: ObjectId(blogId)},
            {$set: {comments: newComments}}
        );
        if (postUpdate.modifiedCount === 0){
            throw 'could not post comment.'
        }

        return newComment;
    },
    async deleteComment(blogId, commentId){
        // Find the post.
        const blogCollection = await blog();
        let post = await blogCollection.findOne({_id: ObjectId(blogId)});
        if (post === null){
            throw 'Bad blogpost ID.';
        }

        let newComments = post.comments;
        let index = -1;
        for (let i = 0; i < newComments.length; i++){
            if (newComments[i]._id.equals( ObjectId(commentId) ) ){
                index = i;
                break;
            }
        }
        if (index === -1){
            throw 'Bad comment ID.';
        }
        //Remove comment.
        let deleted = newComments[index];
        newComments.splice(index, 1);
        //Update the post.
        const postUpdate = await blogCollection.updateOne(
            {_id: ObjectId(blogId)},
            {$set: {comments: newComments}}
        );
        if (postUpdate.modifiedCount === 0){
            throw 'could not post comment.'
        }

        return deleted;
    }
};