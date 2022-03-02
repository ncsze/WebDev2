const data = require("../data");
const shows = data.shows;

const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


const constructorMethod= app=>{

    app.get('/', async (req, res) => {
        let homeExists = await client.existsAsync('homepage');
        if (homeExists === 1){
            //Grab the cached (pre-rendered) HTML and send to client
            let cachedPage = await client.getAsync('homepage');
            res.send(cachedPage);
        }else{
            try {
                const showList = await shows.getMainShows();
                const pageData = {
                    title: "Epic Home Page B-)",
                    showList: showList
                };
                
                res.render('home', pageData, async function(err, html){
                    if (err){throw err};
                    const storeHtml = await client.setAsync('homepage',html);
                    res.send(html);
                });
            } catch (e) {
                const error = {
                    title: "Home Page: Error" ,
                    error: e
                };
                res.status(500).render('error',error);
            }
        }
    });

    app.get('/show/:id', async (req,res) =>{
        let showExists = await client.existsAsync('show:'+req.params.id);
        if (showExists === 1){
            let cachedHtml = await client.getAsync('show:'+req.params.id);
            res.send(cachedHtml);
        }else{
            try {
                const id = req.params.id;
                const show = await shows.getShowById(id);
    
                res.render('show',{
                    title: show.name,
                    show: show
                }, async function(err,html){
                    if (err){throw err};
                    const storeHtml = await client.setAsync('show:'+req.params.id,html);
                    res.send(html);
                });
    
            } catch (e) {
                const error = {
                    title: "Show by ID: Error" ,
                    error: e
                };
                if (e === "Not found!"){
                    res.status(404).render('error',error);
                }else{
                    res.status(404).render('error',error);
                }
            }
        }
    });
    

    app.post('/search', async (req, res) =>{
        const searchTerm = req.body['searchTerm'].toString().trim();

        if (searchTerm !== ""){
            // If our search term is valid, work with the redis.
            if (await client.existsAsync('searchterms') === 1 && await client.zrankAsync('searchterms',searchTerm) !== null){
                const incrementSearch = await client.zincrby('searchterms',1, searchTerm);
            }else{
                const addSearch = await client.zaddAsync('searchterms',1,searchTerm);
            }
        }
        

        if (await client.existsAsync('search:'+searchTerm) === 1){
            res.send(await client.getAsync('search:'+searchTerm));
        }else{
            try {
            
                const showList = await shows.getShows(searchTerm);
    
                res.render('search',{
                    title: "Shows Found",
                    searchTerm: searchTerm,
                    showList: showList
                }, async function(err,html){
                    if (err){throw err};
                    const storeHtml = await client.setAsync('search:'+searchTerm,html);
                    res.send(html);
                });
    
    
            } catch (e) {
                res.status(400).render('error', {title: "Keyword Search: Error",error: e});
            }
        }
        
    });

    /*
    This route will display the top 10 search terms that are stored in our sorted set. 
    You will return the 10 search terms from our sorted set with the highest number of searches being first in the list. 
    You will then pass in the top 10 search terms into a handlebars template and display them in ol or ul
    Note:  You must render a full HTML page, no raw JSON data just dumped to the page. This page does not have to be cached. 
    */
    app.get('/popularsearches', async (req, res) => {
        try {
            let searchList = [];
            if( await client.existsAsync('searchterms') === 1){
                searchList = await client.zrevrangeAsync('searchterms',0,10);
            }
            res.render('popularsearches',{title: "Most Popular Searches", searchList: searchList});
        } catch (e) {
            const error = {
                title: "Popular Searches: Error" ,
                error: e
            };
            res.status(500).render('error',error);
        }
        
    });

    
    app.use("*", (req,res) =>{
        res.status(404).render('error',{title: "404",error: "Not found"});
    })
};

module.exports = constructorMethod;