const data = require("../data");
const pokemon = data.pokemon;

const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const constructorMethod= app=>{

    app.get('/pokemon/page/:page', async (req, res) => {
        let pageExists = await client.existsAsync('page:'+req.params.page);
        if (pageExists === 1){
            let cachedPage = await client.getAsync('page:'+req.params.page);
            res.status(200).send(JSON.parse(cachedPage) );
        }else{
            try{
                let pageData = await pokemon.getPokemonPage(req.params.page);
                const storePage = await client.setAsync('page:'+req.params.page, JSON.stringify(pageData) );
                res.status(200).send(pageData);
            }catch (e){
                res.status(404).json({message: "Not Found"});
            }
        }
    });

    app.get('/pokemon/:id', async (req,res) =>{
        let pokemonExists = await client.existsAsync('pokemon:'+req.params.id);
        if (pokemonExists === 1){
            let cachedPage = await client.getAsync('pokemon:'+req.params.id);
            res.status(200).send(JSON.parse(cachedPage));
        }else{
            try{
                let pokeData = await pokemon.getPokemon(req.params.id);
                const storePoke = await client.setAsync('pokemon:'+req.params.id, JSON.stringify(pokeData) );
                res.status(200).send(pokeData);
            }catch (e){
                res.status(404).json({message: "Not Found"});
            }
        }
    });

    app.use("*", (req,res) =>{
        res.status(404).json({message: "Not Found"});
    })
};

module.exports = constructorMethod;