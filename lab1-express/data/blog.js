const mongoCollections = require('../config/mongoCollections');
const blog = mongoCollections.blog;
let { ObjectId } = require('mongodb');

module.exports = {
    async getPost(id){
        if (!id || typeof(id) !== 'string' || id.trim() === ""){
            throw 'id missing or of incorrect type.';
        }
        const blogCollection = await blog();
        let post = await blogCollection.findOne({_id: ObjectId(id)});
        if (post === null){
            throw 'Bad ID.';
        }
        return post;
    },
    async getPosts(skip, take){
        if (skip && (typeof(skip) !== 'number' || skip < 0)){
            throw 'error: skip must be a non-negative number.';
        }
        if (take && (typeof(take) !== 'number' || take < 0 || take > 100)){
            throw 'error: take must be a number in the range of [0,100].';
        }
        let num_skip = 0;
        if (skip){
            num_skip = skip;
        }

        const blogCollection = await blog();

        let posts = await blogCollection.find({}).skip(num_skip).limit(take).toArray();

        if (posts === null){
            throw 'post retrieval failed.'
        }

        return posts;
    },
    async addPost(title, body, user){
        if (!title || !body){
            throw 'title or body missing.';
        }
        if (typeof(title) !== 'string' || title.trim() === ""){
            throw 'title must be a non-empty string.';
        }
        if (typeof(body) !== 'string' || body.trim() === ""){
            throw 'body must be a non-empty string.';
        }
        let userThatPosted = {
            _id: user._id,
            username: user.username
        };
        const blogCollection = await blog();

        let newPost = {
            title: title,
            body: body,
            userThatPosted: userThatPosted,
            comments: []
        };

        const insertion = await blogCollection.insertOne(newPost);
        if (insertion.insertedCount === 0){
            throw 'could not add post.';
        }

        newPost._id = insertion.insertedId;
        return newPost;

    },
    async updatePost(id, title, body){
        if (!id || typeof(id) !== 'string' || id.trim() === ""){
            throw 'id missing or of incorrect type.';
        }

        if (title && (typeof(title) !== 'string' || title.trim() === "")){
            throw 'title must be a non-empty string.';
        }
        if (body && (typeof(body) !== 'string' || body.trim() === "")){
            throw 'body must be a non-empty string.';
        }

        // Find the post.
        const blogCollection = await blog();
        let post = await blogCollection.findOne({_id: ObjectId(id)});
        if (post === null){
            throw 'Bad ID.';
        }

        let updateparams = {};
        if (title){
            updateparams.title = title;
        }if (body){
            updateparams.body = body;
        }

        //Update the post.
        const postUpdate = await blogCollection.updateOne(
            {_id: ObjectId(id)},
            {$set: updateparams}
        );
        if (postUpdate.modifiedCount === 0){
            throw 'could not update post.'
        }

        return this.getPost(id);
    }
};