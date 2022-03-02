const { ApolloServer, gql } = require('apollo-server');
const uuid = require('uuid');
const axios = require('axios');

const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// BASED ON PATRICK HILL'S CS554 LECTURE CODE REGARDING APOLLO + REACT

const typeDefs = gql`
  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
  }
  type Query {
    unsplashImages(pageNum: Int) : [ImagePost]
    binnedImages : [ImagePost]
    userPostedImages : [ImagePost]
  }
  type Mutation {
    uploadImage(url: String!, description: String, posterName: String) : ImagePost
    updateImage(id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean) : ImagePost
    deleteImage(id: ID!) : ImagePost
  }
`;
// NOTE: This URL uses my ID for unsplash. If you'd like to make your own application with unsplash, register your own key.
// https://api.unsplash.com/photos/?client_id=yyy2WoqugJN1yfa9Tlw1gbUy2brY99MiqkzAwTO0RMQ&page=${}

const resolvers = {
  Query: {
    unsplashImages: async (_, {pageNum}) => {
      
      let data;
      if (pageNum){
        const fetch = await axios.get(`https://api.unsplash.com/photos/?client_id=yyy2WoqugJN1yfa9Tlw1gbUy2brY99MiqkzAwTO0RMQ&page=${pageNum}`);
        data = fetch.data;
      }else{
        const fetch = await axios.get(`https://api.unsplash.com/photos/?client_id=yyy2WoqugJN1yfa9Tlw1gbUy2brY99MiqkzAwTO0RMQ`);
        data = fetch.data;
      }
      
      
      let imagePosts = data.map( (img) => {
        let desc = "N/A"
        desc = ((img.alt_description !== null)? img.alt_description: desc)
        desc = ((img.description !== null)? img.description: desc)

        let newPost = {
          id: img.id,
          url: img.urls.regular,
          posterName: (img.user.name !== null ? img.user.name : "N/A"),
          description: desc,
          userPosted: false,
          binned: false
        }
        return newPost;
      });



      return imagePosts;
    },
    binnedImages: async () => {
      let haveBinnedPosts = await client.existsAsync("binnedposts");
      if(haveBinnedPosts === 0){
        return [];
      }
      let redisStrings = await client.hvalsAsync("binnedposts");
      let imagePosts = redisStrings.map( (element) =>{
        return JSON.parse(element);
      } );
      return imagePosts;
    },
    userPostedImages: async () => {
      let haveuserposts = await client.existsAsync("userposts");
      if(haveuserposts === 0){
        return [];
      }
      let redisStrings = await client.hvalsAsync("userposts");
      let imagePosts = redisStrings.map( (element) =>{
        return JSON.parse(element);
      } );
      return imagePosts;
    }
  },
  Mutation: {
    /*
    uploadImage(url: String!, description: String, posterName: String) -> ImagePost: This mutation will create
    an ImagePost and will be saved in Redis. Outside of the provided values from the “New Post” form, by default, 
    the following values of ImagePost should be:

    binned: false
    userPosted: true
    id: a uuid
    */
    uploadImage: async (_, {url, description, posterName}) => {
      let newImage = {
        id: uuid.v4(),
        url: url,
        posterName: (posterName ? posterName : "N/A"),
        description: (description ? description : "N/A"),
        userPosted: true,
        binned: false
      }
      //Save to redis
      await client.hsetAsync("userposts", newImage.id, JSON.stringify(newImage));
      return newImage;
    },
    updateImage: async (_, {id , url, posterName, description, userPosted, binned}) => {
      let haveUserPosts = await client.existsAsync("userposts");
      let haveBinnedPosts = await client.existsAsync("binnedposts");
      //Find an existing post in userposts or binnedposts matching the id.
      //If it's in both collections, only bother finding one: update both after.
      let haveIdPosted = 0;
      let haveIdBinned = 0;
      if (haveUserPosts === 1){ // Check userposts for the id.
        if ( await client.hexistsAsync("userposts", id) === 1){
          haveIdPosted = 1;
        }
      }if (haveBinnedPosts === 1){ // Check binnedposts for the id.
        if ( await client.hexistsAsync("binnedposts", id) === 1){
          haveIdBinned = 1;
        }
      }

      //actually get the old post now.
      let oldPost; // Initialize undefined -- May not exist. 
      if (haveIdBinned === 1){
        oldPost = await client.hgetAsync("binnedposts", id);
      }else if (haveIdPosted === 1){
        oldPost = await client.hgetAsync("userposts", id);
      }


      if (oldPost !== undefined){ //Updating a cached post since oldpost exists
        oldPost = JSON.parse(oldPost); //Convert from string to object

        let newPost = {
          id: id, // This HAS to be defined.
          url: (url !== undefined ? url: oldPost.url),
          posterName: (posterName !== undefined ? posterName: oldPost.posterName),
          description: (description !== undefined ? description: oldPost.description),
          userPosted: (userPosted !== undefined ? userPosted: oldPost.userPosted),
          binned: (binned !== undefined ? binned: oldPost.binned)
        }

        //If the image was binned before and is no longer binned remove it from binnedposts.
        if (binned !== undefined && (binned === false && oldPost.binned === true)){
          await client.hdelAsync("binnedposts", id);
        }
        //Shouldn't need to check for removing from userposts, but here it is just in case.
        if (userPosted !== undefined && (userPosted === false && oldPost.userPosted === true)){
          await client.hdelAsync("userposts", id);
        }

        if (newPost.userPosted){
          await client.hsetAsync("userposts", newPost.id, JSON.stringify(newPost));
        }if (newPost.binned){
          await client.hsetAsync("binnedposts", newPost.id, JSON.stringify(newPost));
        }

        return newPost;


      }else{ //Binning a new post
        let newPost = {
          id: id, //Everything needs to be defined in this case.
          url: url,
          posterName: (posterName !== undefined ? posterName : "N/A"),
          description: (description !== undefined ? description : "N/A"),
          userPosted: (userPosted !== undefined ? userPosted : false),
          binned: (binned !== undefined ? binned : false)
        }
        if (newPost.url === undefined || newPost.id === undefined){
          throw 'URL or ID missing for a new binned post!';
        }
        if (newPost.userPosted){
          await client.hsetAsync("userposts", newPost.id, JSON.stringify(newPost));
        }if (newPost.binned){
          await client.hsetAsync("binnedposts", newPost.id, JSON.stringify(newPost));
        }
        return newPost;
      }
    },
    deleteImage: async (_, {id}) => {
      let haveUserPosts = await client.existsAsync("userposts");
      let haveBinnedPosts = await client.existsAsync("binnedposts");
      let haveIdPosted = 0;
      let haveIdBinned = 0;
      if (haveUserPosts === 1){ // Check userposts for the id.
        if ( await client.hexistsAsync("userposts", id) === 1){
          haveIdPosted = 1;
        }
      }if (haveBinnedPosts === 1){ // Check binnedposts for the id.
        if ( await client.hexistsAsync("binnedposts", id) === 1){
          haveIdBinned = 1;
        }
      }

      if (haveIdPosted === 1){
        // Delete the entry in userposts
        let oldPost = await client.hgetAsync("userposts", id);
        await client.hdelAsync("userposts", id);
        // Delete it from binnedposts if it's also there.
        if (haveIdBinned === 1){
          await client.hdelAsync("binnedposts", id);
        }
        return JSON.parse(oldPost);
      }
      if (haveIdPosted === 0 && haveIdBinned === 0){
        throw `No post found with id ${id}`;
      }
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
